var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// the top-level properties in SongSchema are the ones required for our core
// functionality. most come from the source and are normalized as necessary
// (ex: converting played_at timestamps to UTC, fixing charset issue).
// others (id, hash, etc.) are somewhat internal and generated upon ingestion.
// the degree to which data is normalized/fixed depends on how reliable the
// source is. all unmodified source data is stored under raw_source.
var SongSchema = Schema({
  id:        ObjectId, // BSON object ID
  station:   String,   // Station adapter name, so we know which station the song came from
  played_at: Date,     // ISO8601 timestamp (in UTC)
  title:     String,   // song title
  artist:    String,   // artist name
  album:     String,   // album name
  year:      Number,   // release year
  label:     String,   // record label
  // hash:      String,   // sha1 hash of title, artist, album. might be useful for finding similar items
  // artwork: TBD
  raw_source: Schema.Types.Mixed // unaltered data from source
});

SongSchema.index({
  'title': 'text',
  'artist': 'text',
  'album': 'text',
  'label': 'text'
}, {
  name: 'FullTextIndex',
  default_language: 'english',
  weights: {
    title: 10,
    artist: 10,
    album: 5
  }
});

var Song = mongoose.model('Song', SongSchema);

// TODO: add validation to song model

module.exports = Song;
