var Station = require('../station');
var Tracklist = require('../tracklist');

var request = require('superagent');
var _ = require('lodash');

var logger = require('../logger');

var PLAYLIST_JSON_URL = 'https://api.composer.nprstations.org/v1/widget/5834b54de1c8aada9f4d7a9e/playlist';
var REFERER_URL = 'http://composer.nprstations.org/widgets/iframe/searchlist.html?station=5834b54de1c8aada9f4d7a9e&visible=songsearch&show_comp=true';

var STATION_NAME = 'WBGO Jazz 88.3 FM';
var STATION_HOMEPAGE = 'http://wbgo.org/';

var YEAR_REGEXP = /\b(\d{4})\b/;
var LABEL_REGEXP = /(?:\b\d{4}\b)\s*?(.+?)(?:\. All rights reserved\..+)?$/;

// FIXME: pretty much what's in kcrw-electric24.js
function getData() {
  // bind to 'this' so we can use and operate on the station properties
  var buildRequestURL = function() {
    // TODO: use the rangeQueue to iterate over the range
    return PLAYLIST_JSON_URL + '?' +
      't=' + Date.now() + '&' +
      'limit=' + this.options.pageSize + '&' +
      'order=' + '-1';
  }.bind(this);

  // only make HTTP request if we're either 1) not using a range queue, or
  // 2) if the queue has items in it.
  if (
    (this.rangeQueue === null) ||
    (this.rangeQueue && this.rangeQueue.length > 0)
  ) {
    var REQUEST_URL = buildRequestURL();

    logger.info('----');
    logger.info('Requesting ' + REQUEST_URL);

    // TODO: maybe add UA header here to make our requests less conspicuous?
    request
      .get(REQUEST_URL)
      .set('Referer', REFERER_URL)
      .end(responseHandler.bind(this));
  }
}


// NOTE: this function is bound onto the Station object.
function responseHandler(err, res) {

  // TODO: handle errors better
  if (err) {
    logger.error(err);

    // TODO: pass some status to stopListening()
    this.stopListening();

    return false;
  }

  var tracks = [];

  // top-level playlist key is an array of shows/programs.
  // next-level-down playlist key is an array of tracks.
  res.body.playlist.forEach(function(program){
    var radio_show = _.omit(program, 'playlist');

    // add radio_show to each program's raw data
    var modified_tracks = program.playlist.map(function(t) {
      t.radio_show = radio_show;
      return t;
    });

    tracks = tracks.concat(modified_tracks);
  });

  // create song objects from raw data (array of tracks)
  var tracklist = new Tracklist(STATION_NAME, tracks);

  tracklist.extractAndNormalizeData({
    // TODO: determine what happens when some properties are empty/null
    played_at: function(raw) {
      // FIXME: figure out how remove this insane hardcoding of the UTC offset
      return new Date(raw._start_time + " -0400").toISOString();
    },
    title:     function(raw) { return raw.trackName; },
    artist:    function(raw) { return raw.artistName; },
    album:     function(raw) { return raw.collectionName; },
    year:      function(raw) {
      var res = YEAR_REGEXP.exec(raw.label);
      return (res === null) ? null : parseInt(res[1], 10);
   },
    label:     function(raw) {
      var label = LABEL_REGEXP.exec(raw.label);
      return (res === null) ? null : res[1];
    }
  });

  // TODO: once we move beyond simple cli usage, "printing" the list will
  // take on a different form.
  tracklist.print(function(t) {
    return '"' + t.title + '" by ' + t.artist + ' off the album "' + t.album + '"';
  });

  tracklist.save().then(function() {
    // exit after saving tracklist if we're in oneshot mode or range mode
    // (and the queue is empty)
    if (this.options.oneShot || (this.rangeQueue && this.rangeQueue.length === 0)) {
      this.stopListening();
    }
  }.bind(this));
}


module.exports = new Station({
  'name': STATION_NAME,
  'homepage': STATION_HOMEPAGE,
  'getData': getData
});
