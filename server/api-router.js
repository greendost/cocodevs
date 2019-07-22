import express from 'express';
import sqlite from 'sqlite';

var db;
(async function() {
  db = await sqlite.open('./app.db');
})();

var router = express.Router();

// return listings with tags
router.get('/listings', async (req, res) => {
  try {
    var data = await db.all(
      'SELECT listings.id, url, title, listings.description, \
      listings.timestamp, GROUP_CONCAT(tags.description) AS tags FROM listings \
      LEFT JOIN listings_tags ON listings.id = listings_tags.listing_id \
      LEFT JOIN tags ON listings_tags.tag_id = tags.id \
      GROUP BY listings.id;'
    );
  } catch (err) {
    console.log('err: ', err);
    res.json({ error: 'database updated, but problem reading updated data' });
  }
  res.json({ data });
});

router.get('/tags', async (req, res) => {
  try {
    var data = await db.all(
      'SELECT description,timestamp FROM tags ORDER BY timestamp DESC'
    );
  } catch (err) {
    console.log('error: ', err);
    res.json({ error: 'problem retrieving tags from database' });
    return;
  }
  res.json({ data });
});

// this will add a listing, any tags, and the mapping between them
// probably not proper rest semantics
router.post('/listings', async (req, res) => {
  var data = req.body.data;
  //   console.log('\ndata=', data);

  // extract out data received; should sanitize TODO
  var tags = data.tags.trim();
  if (tags) {
    tags = tags.split(',').map(x => x.trim());
  } else {
    tags = [];
  }
  var url = data.url;
  var title = data.title;
  var description = data.description;

  // update listings, tags, and listings_tags
  var listingId = null;
  try {
    // insert listing
    var stmt = await db.prepare(
      `INSERT INTO listings VALUES (null,?,?,?,datetime())`
    );
    var runData = await stmt.run([url, title, description]);
    listingId = runData['stmt']['lastID'];

    // insert tags
    stmt = await db.prepare(
      'INSERT OR IGNORE INTO tags VALUES (null,?,datetime())'
    );
    var tagsPerListingId = [];
    for (var i = 0; i < tags.length; i++) {
      var runData = await stmt.run(tags[i]);
      if (runData['stmt']['changes']) {
        var tagId = runData['stmt']['lastID'];
        tagsPerListingId.push({ listingId, tagId });
      } else {
        // TODO: remove from loop, maybe use WHERE IN (tag1, tag2, ... );
        var tagId = (await db.all('SELECT id FROM tags where description = ?', [
          tags[i]
        ]))[0]['id'];
        tagsPerListingId.push({ listingId, tagId });
      }
    }

    // update listings_tags
    stmt = await db.prepare(
      'INSERT OR IGNORE INTO listings_tags VALUES (null,?,?)'
    );

    for (var i = 0; i < tagsPerListingId.length; i++) {
      await stmt.run(
        tagsPerListingId[i]['listingId'],
        tagsPerListingId[i]['tagId']
      );
    }
  } catch (err) {
    console.log('err: ', err);
    res.json({ error: 'problem inserting into database' });
    return;
  }

  // read listings, with tags
  try {
    // var listings = await db.all(
    var data = await db.all(
      'SELECT listings.id, url, title, listings.description, \
      listings.timestamp, GROUP_CONCAT(tags.description) AS tags FROM listings \
      LEFT JOIN listings_tags ON listings.id = listings_tags.listing_id \
      LEFT JOIN tags ON listings_tags.tag_id = tags.id \
      GROUP BY listings.id;'
    );

    var resultData = data;
  } catch (err) {
    console.log('err: ', err);
    res.json({ error: 'database updated, but problem reading updated data' });
  }

  res.json({ data: resultData });
});

export default router;
