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

}


// main entry point with single argument, the object holding our effective configuration
Station.prototype.startListening = function(options) {

  // store passed options on our station instance
  this.options = options;

  // call getData explicitly since setInterval waits before the first call.
  this.getData();

  // call the getData method (bound to 'this' to retain context), passing the
  // options as an argument.
  this.refreshIntervalTimer = setInterval(
    this.getData.bind(this),
    this.options.refreshInterval * 1000
  );

};


Station.prototype.stopListening = function(status) {

  // cancel the refreshing
  clearInterval(this.refreshIntervalTimer);

  console.log('Listening stopped.');

  // TODO: refine exit codes based on status.
  process.exit(1);

};


module.exports = Station;
