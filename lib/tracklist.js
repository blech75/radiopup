var _ = require('lodash');

var logger = require('./logger');
var models = require('./mongoose-models');


function Tracklist(station, tracks) {
  // TODO: mo betta type/data checking
  // FIXME: actually catch the error we throw
  if (!_.isArray(tracks)) {
    throw new Error('Invalid JSON data.');
  }

  // set the station of this tracklist
  // TODO: in theory this should be checked against list of valid stations
  this.station = station;

  // emit a warning if tracklist has no items in it. we should be able to
  // handle a zero-length tracklist in our normal operations, so this is not
  // an error, per se. also, a zero length list this result may be a temporary
  // condition.
  if (tracks.length < 1) {
    logger.warn('Warning: No songs in track list.');
  }

  // create array of song objects from array of JSON data. note that we're
  // just adding the bare minimum items here because each station will need to
  // implement its own extraction method.
  this.tracks = _.map(tracks, function(track) {
    return new models.song({
      station: station,
      raw_source: track
    });
  });

}

// rules is hashmap of properties and their mapping functions that accept one
// argument: the song's raw_data property. required properties to set are:
// played_at, title, artist, album.
// TODO: devise some way to have default extraction rules so we just need to
// pass in those that are 'special'. maybe something along the lines of the
// defaultSongFormatter in print()?
Tracklist.prototype.extractAndNormalizeData = function(rules) {
  this.tracks.forEach(function(song) {
    _.forIn(rules, function(mapFn, prop) {
      song[prop] = mapFn(song.raw_source);
    });
  });
};


Tracklist.prototype.save = function(filterFunction) {
  // avoids binding problems
  var station = this.station;

  // apply the supplied filter function which specifies which tracks to include
  var tracksToSave = _.filter(this.tracks, filterFunction || _.identity(true));

  tracksToSave.forEach(function(song) {
    // before saving, see if the track exists in the DB to avoid duplication.
    // TODO: devise a different acid test for determining if a track should be
    // skipped. for the moment, we're using played_at and station since only
    // one track can be on a station at a time and the played_at is stable.
    // TODO: be a little less chatty here w/r/t console output.
    models.song.count({
      played_at: song.played_at,
      station: station
    }).then(function(result) {
      if (result === 0) {
        song.save().then(function() {
          // TODO: move to 'post' hook
          logger.info('Saved ' + song.title);
        });
      } else {
        logger.verbose('Skipped saving ' + song.title + '. Already exists.');
      }
    });
  });
};


Tracklist.prototype.print = function(formatFunction) {
  // could be two modes here: 1) verbose output for viewing changes over time,
  // and 2) simpler view that 'refreshes' via curses functionality.

  // output simple track listing for cli
  logger.info(
    _.map(this.tracks, function(o, idx) {
      var output = '';

      output += '[' + o.played_at.toLocaleTimeString() + '] ';
      output += (formatFunction || defaultSongFormatter)(o);

      return output;
    })
    .join('\n')
  );

  function defaultSongFormatter(o) {
    return '"' + o.title + '" by ' + o.artist;
  }
};


module.exports = Tracklist;
