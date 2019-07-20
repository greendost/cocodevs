DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS listings_tags;

CREATE TABLE listings
(
    id INTEGER PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    timestamp DATETIME NOT NULL
);

CREATE TABLE tags
(
    id INTEGER PRIMARY KEY,
    description VARCHAR(80) NOT NULL UNIQUE,
    timestamp DATETIME NOT NULL
);

CREATE TABLE listings_tags
(
    id INTEGER PRIMARY KEY,
    listing_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings,
    FOREIGN KEY (tag_id) REFERENCES tags
);

