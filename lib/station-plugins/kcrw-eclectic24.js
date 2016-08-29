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

function getData(config) {
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

  // bail out early if response has no items in it.
  // TODO: do something with this info.
  if (res.body.length < 1) {
    console.log('Error: No items in playlist.');
    return false;
  }

  var playlist = res.body;

  console.log('----');
  console.log(
    _.map(playlist, function(o, idx) { return (idx + 1).toString() + ': ' + o.title; })
    .join('\n')
  );

}

module.exports = new Station({
  'name': 'KCRW Eclectic24',
  'homepage': 'http://www.kcrw.com/music/shows/eclectic24',
  'getData': getData
});
