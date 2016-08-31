var _ = require('lodash');

var models = require('./mongoose').models;


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
    console.log('Warning: No songs in track list.');
  }

  // create array of song objects from array of JSON data
  // TODO: add validation to song model and/or pre-validate data before using
  // it. in other words, all massaging of data shoud not happen here.
  this.tracks = _.map(tracks, function(track) {
    return new models.song({
      station: station,
      played_at: new Date(track.datetime).toISOString(),
      title: track.title,
      artist: track.artist,
      album: track.album,
      raw_source: track
    });
  });

}


Tracklist.prototype.normalize = function() {

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
    models.song.count({
      played_at: new Date(song.played_at.toISOString()),
      station: station
    }).then(function(result) {
      if (result === 0) {
        song.save().then(function() {
          console.log('Saved ' + song.title);
        });
      } else {
        console.log('Skipped saving ' + song.title + ". Already exists.");
      }
    });
  });
};


Tracklist.prototype.print = function(filterFunction) {
  // could be two modes here: 1) verbose output for viewing changes over time,
  // and 2) simpler view that 'refreshes' via curses functionality.

  // output simple track listing for cli
  console.log('----');

  console.log(
    _.map(this.tracks, function(o, idx) {
      var output = '';

      output += (new Date(o.played_at)).toLocaleTimeString() + ': ';
      // output += (idx + 1).toString() + ': ';

      if (o.artist === '[BREAK]') {
        output +=  o.artist;
      } else {
        output += '"' + o.title + '" by ' + o.artist;
      }

      return output;
    })
    .join('\n')
  );
};


module.exports = Tracklist;
