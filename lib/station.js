var _ = require('lodash');

var logger = require('./logger');

// constructor used by all station plugins
function Station(s) {
  // TODO: add validation during instantiation

  // descriptive/proper/human name for the station
  this.name = s.name;

  // URL to stations's homepage (not necessarily the playlist)
  this.homepage = s.homepage;

  // function specific to the station that handles the retrieval of the data
  this.getData = s.getData;

  // timer object
  this.refreshIntervalTimer = null;

  // store runtime options for stations
  // TODO: consider moving off station objects.
  this.options = {};

  // array that stores list of dates/pages/etc. to retrieve sequentially.
  // used when not listening "live".
  this.rangeQueue = null;

  // flag to prevent mutliple listening from startin
  this.isListening = false;

  // TODO: add timezone name (e.g. "America/Los_Angeles")
}


// main entry point with single argument, the object holding our effective configuration
Station.prototype.startListening = function(options) {
  // bail out early if this station is already listening. need to consider
  // when this could happen.
  if (this.isListening) {
    logger.error('Sorry, the station is already listening.');

    // TODO: revisit this during error handling evaluation.
    return;
  }

  // flip the flag to indicate we're now listening
  this.isListening = true;

  // store passed options on our station instance
  this.options = options;

  // set the rangeQueue if we're passing a range
  if (this.options.range) {
    this.rangeQueue = divideRange(this.options.range[0], this.options.range[1]);

    logger.info('Retrieving range: ' + this.options.range[0] + ' to ' + this.options.range[1] + ' as ' + this.rangeQueue.join(","));
  }

  // call getData explicitly since setInterval waits before the first call.
  this.getData();

  // don't do anything else after getData if we're in one-shot mode.
  if (this.options.oneShot) {
    return;
  }

  // call the getData method (bound to 'this' to retain context), passing the
  // options as an argument.
  this.refreshIntervalTimer = setInterval(
    this.getData.bind(this),
    this.options.refreshInterval * 1000
  );


  // divides a (large) date range into a list of smaller ones so that getData
  // can request more manageable sizes
  function divideRange(rangeStart, rangeEnd) {
    var rangeList = [];

    // handle page numbers
    // TODO: be a little more thorough in checking validity of each type of
    // range.
    if (parseInt(rangeStart).toString() === rangeStart) {
      // rangeEnd is not inclusive, so add one. use a range 'step' of 1.
      rangeList = _.range(parseInt(rangeStart), parseInt(rangeEnd) + 1, 1);

    } else {
      // TODO: handle dates
    }

    return rangeList;
  }

};


Station.prototype.stopListening = function(status) {

  // cancel the refreshing
  clearInterval(this.refreshIntervalTimer);

  logger.info('Listening stopped.');

  // TODO: exit through a more central method instead of right here.
  process.exit(0);

};


module.exports = Station;
