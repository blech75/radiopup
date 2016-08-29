var Station = require('../station');
var request = require('superagent');
var _ = require('lodash');

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

  // JSON body is array of tracks
  // TODO: inspect/validate response is JSON before attempting to process it
  // as JSON.
  var tracklist = res.body;

  // bail out early if response has no items in it.
  // don't stop listening, though, because this result may be temporary.
  if (tracklist.length < 1) {
    console.log('Error: No items in track list.');

    // TODO: propagate this info further up or throw an error.
    return false;
  }

  // output simple track listing
  console.log('----');
  console.log(
    _.map(tracklist, function(o, idx) {
      var output = (idx + 1).toString() + ': ';

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

module.exports = new Station({
  'name': 'KCRW Eclectic24',
  'homepage': 'http://www.kcrw.com/music/shows/eclectic24',
  'getData': getData
});
