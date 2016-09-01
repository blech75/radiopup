var _ = require('lodash');

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
}


// main entry point with single argument, the object holding our effective configuration
Station.prototype.startListening = function(options) {

  // store passed options on our station instance
  this.options = options;

  // set the rangeQueue if we're passing a range
  if (this.options.range) {
    this.rangeQueue = divideRange(this.options.range[0], this.options.range[1]);

    console.log('Retrieving range: ' + this.options.range[0] + ' to ' + this.options.range[1] + ' as ' + this.rangeQueue.join(","));
  }

  // call getData explicitly since setInterval waits before the first call.
  this.getData();

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

  console.log('Listening stopped.');

  // TODO: refine exit codes based on status.
  process.exit(1);

};


module.exports = Station;
