var Station = require('../station');
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

// TODO: use template for URL to allow for dynamic range and page size
var PLAYLIST_JSON_URL = 'http://tracklist-api.kcrw.com/Music/all/1?page_size=10';
var REFERER_URL = 'http://www.kcrw.com/@@playlists?channel=Music';


function getData() {
  // TODO: maybe add UA header here to make our requests less conspicuous?
  request
    .get(PLAYLIST_JSON_URL)
    .set('Referer', REFERER_URL)
    .end(responseHandler.bind(this));
}


function responseHandler(err, res) {

  // TODO: handle errors better
  if (err) {
    console.log(err);

    // TODO: pass some status to stopListening()
    this.stopListening();

    return false;
  }

  var tracklist = parseResponse(res.body);

  // TODO: once we move beyond simple cli usage, "printing" the list will
  // take on a different form.
  printTracklist(tracklist);

  storeTracklist(tracklist);
}


function parseResponse(jsonData) {
  // JSON body is array of tracks
  // TODO: inspect/validate response is JSON before attempting to use JSON
  var tracklist = jsonData;

  // bail out early if response has no items in it.
  // don't stop listening, though, because this result may be temporary.
  if (tracklist.length < 1) {
    console.log('Error: No items in track list.');
  }

  // TODO: conform data to our internal data model, saving raw data under
  // 'raw' attribute

  return tracklist;
}


function printTracklist(tracklist) {
  // output simple track listing for cli
  console.log('----');
  console.log(
    _.map(tracklist, function(o, idx) {
      var output = "";

      output += (new Date(o.datetime)).toLocaleTimeString()+ ': ';
      // output += (idx + 1).toString() + ': ';

      if (o.artist === "[BREAK]") {
        output +=  o.artist;
      } else {
        output += '"' + o.title + '" by ' + o.artist;
      }

      return output;
    })
    .join('\n')
  );
}


function storeTracklist(tracklist) {
  // TODO: save tracks to mongodb
}


module.exports = new Station({
  'name': 'KCRW Eclectic24',
  'homepage': 'http://www.kcrw.com/music/shows/eclectic24',
  'getData': getData
});
