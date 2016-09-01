var Station = require('../station');
var Tracklist = require('../tracklist');

var request = require('superagent');
var _ = require('lodash');


// KCRW Eclectic 24 Station Adapter
// ================================
//
// The basic template for JSON data URL is:
//
//   http://tracklist-api.kcrw.com/Music/all/PAGE_NUM?page_size=PAGE_SIZE
//
// If no PAGE_SIZE is explicitly passed (e.g. http://tracklist-api.kcrw.com/Music/all/1),
// 100 items are returned.
//
// NOTE: The offical site uses PAGE_SIZE set to 35 and also includes the
// 'callback' param which wraps the JSON in a callback function:
//
//   http://tracklist-api.kcrw.com/Music/all/1?page_size=35&callback=$.KCRW.build_tracklist
//
// We don't want that (makes parsing more difficult), so we won't include
// that callback param (for now, at least).
//
// NOTE: The AJAX request via the offical site also includes the Referer
// header, which we should include.
//
//   Referer: http://www.kcrw.com/@@playlists?channel=Music
//
// The JSON response is an array representing the tracks, with each track
// having the following properties (as of 2018-08-29):
//
// - channel [String, name of channel] ex: "Music"
// - datetime [String, ISO8601 timestamp in America/Los_Angeles]
// - time [String, local time in America/Los_Angeles. leading zero, meridiem all caps] ex: "09:05 AM"
// - date [String, local date in in America/Los_Angeles. YYYY-MM-DD] ex: "2016-08-29"
// - program_id [String, unknown. single space]
// - program_title  [String, time range in local time] ex :"9am - Noon"
// - program_start [String, local time. leading zero, no meridiem, 24h clock] ex: "09:00"
// - program_end [String, local time. leading zero, no meridiem, 24h clock] ex: "12:00"
// - host [String, unknown. single space]
// - play_id [Integer, monotonically increasing track ID]
// - offset [Integer, unknown]
// - title [String, song title]
// - artist [String, artist name]
// - artist_url [String, URL of artist website]
// - album [String, album name]
// - albumImage [String ,URL for 75px square image.] note: seems to be a search result, not actual album image
// - albumImageLarge [String, URL for 300px square image]
// - year [Integer, release year]
// - label [String, label details] ex: "BMG Rights Management (US) LLC"
// - comments [String, single space. unused]
// - affiliateLinkiPhone [String, URL]
// - affiliateLinkSpotify [String, custom protocol URL for Spotify] ex: "spotify:search:"
// - affiliateLinkiTunes [String, URL]
// - affiliateLinkAmazon [String, URL]
// - affiliateLinkRdio [String, URL] (NOTE: rdio is dead)
//

var PLAYLIST_JSON_URL = 'http://tracklist-api.kcrw.com/Music/all/';
var REFERER_URL = 'http://www.kcrw.com/@@playlists?channel=Music';

var STATION_NAME = 'KCRW Eclectic24';
var STATION_HOMEPAGE = 'http://www.kcrw.com/music/shows/eclectic24';
var BREAK_STRING = '[BREAK]';


function getData() {
  // bind to 'this' so we can use and operate on the station properties
  var buildRequestURL = function() {
    var page = (this.rangeQueue) ? this.rangeQueue.shift() : 1;
    return PLAYLIST_JSON_URL + page + '?page_size=' + this.options.pageSize;
  }.bind(this);

  // only make HTTP request if we're either 1) not using a range queue, or
  // 2) if the queue has items in it.
  // TODO: simplify these two logic branches; it feels awkward.
  if (
    (this.rangeQueue === null) ||
    (this.rangeQueue && this.rangeQueue.length > 0)
  ) {
    var REQUEST_URL = buildRequestURL();

    console.log('----');
    console.log('Requesting ' + REQUEST_URL);

    // TODO: maybe add UA header here to make our requests less conspicuous?
    request
      .get(REQUEST_URL)
      .set('Referer', REFERER_URL)
      .end(responseHandler.bind(this));

  // if we are using a range queue, and it's empty, stop listening.
  } else if (this.rangeQueue && this.rangeQueue.length === 0) {
    // TODO: make listening stop immediately after the last save is complete.
    // there is no need to wait another interval to find out that our queue is
    // empty.
    this.stopListening();
  }
}


// NOTE: this function is bound onto the Station object.
function responseHandler(err, res) {

  // TODO: handle errors better
  if (err) {
    console.log(err);

    // TODO: pass some status to stopListening()
    this.stopListening();

    return false;
  }

  // create song objects from raw data (array of tracks)
  var tracklist = new Tracklist(STATION_NAME, res.body);

  tracklist.extractAndNormalizeData({
    // TODO: determine what happens when some properties are empty/null
    played_at: function(raw) { return new Date(raw.datetime).toISOString(); },
    title:     function(raw) { return raw.title; },
    artist:    function(raw) { return raw.artist; },
    album:     function(raw) { return raw.album; },
    year:      function(raw) { return raw.year; }
  });

  // TODO: once we move beyond simple cli usage, "printing" the list will
  // take on a different form.
  tracklist.print(function(t) {
    var output = '';
    if (t.artist === BREAK_STRING) {
      output +=  '~~' + t.artist + '~~';
    } else {
      output += '"' + t.title + '" by ' + t.artist;
    }
    return output;
  });

  // when saving, remove all of KCRW's breaks (station IDs) from the
  // tracklist since they are undesired
  tracklist.save(function(t) {
    return t.artist !== BREAK_STRING;
  });
}


module.exports = new Station({
  'name': STATION_NAME,
  'homepage': STATION_HOMEPAGE,
  'getData': getData
});
