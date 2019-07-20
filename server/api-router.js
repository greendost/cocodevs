import express from 'express';
import sqlite from 'sqlite';

var db;
(async function() {
  db = await sqlite.open('./app.db');
})();

var router = express.Router();

router.get('/listings', async (req, res) => {
  try {
    var data = await db.all(
      'SELECT url,title,description,timestamp FROM listings ORDER BY timestamp DESC'
    );
  } catch (err) {
    console.log('error: ', err);
    res.json({ error: 'problem retrieving listings from database' });
    return;
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
  console.log('data=', data);
  var tags = data.tags
    .trim()
    .split(',')
    .map(x => x.trim());

  var url = data.url;
  var title = data.title;
  var description = data.description;

  // insert listing
  try {
    var stmt = await db.prepare(
      `INSERT INTO listings VALUES (null,?,?,?,datetime())`
    );
  } catch (err) {
    console.log('err: ', err);
    res.json({ error: 'problem preparing to insert listing into database' });
    return;
  }

  try {
    await stmt.run([url, title, description]);
  } catch (err) {
    console.log('err: ', err);
    res.json({ error: 'problem inserting listing into database' });
    return;
  }

  // insert tags
  try {
    stmt = await db.prepare(
      'INSERT OR IGNORE INTO tags VALUES (null,?,datetime())'
    );
  } catch (err) {
    console.log('err: ', err);
    res.json({ error: 'problem preparing to insert tags into database' });
    return;
  }

  for (var i = 0; i < tags.length; i++) {
    try {
      await stmt.run(tags[i]);
    } catch (err) {
      console.log('err: ', err);
      res.json({ error: 'problem inserting tags into database' });
      return;
    }
  }

  try {
    var resultListings = await db.all(
      'SELECT url,title,description,timestamp FROM listings ORDER BY timestamp DESC'
    );
  } catch (err) {
    console.log('err: ', err);
    res.json({ error: 'problem reading listings from database' });
    return;
  }

  try {
    var resultTags = await db.all(
      'SELECT description,timestamp FROM tags ORDER BY timestamp DESC'
    );
  } catch (err) {
    console.log('err: ', err);
    res.json({ error: 'problem reading listings from database' });
    return;
  }
  var resultData = { listings: resultListings, tags: resultTags };
  res.json({ data: resultData });
});

export default router;
