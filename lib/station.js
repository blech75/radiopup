// constructor used by all station plugins
function Station(s) {

  // descriptive/proper/human name for the station
  this.name = s.name;

  // URL to stations's homepage (not necessarily the playlist)
  this.homepage = s.homepage;

  // function specific to the station that handles the retrieval of the data
  this.fetch = s.fetch;

  // timer object
  this.refreshIntervalTimer = null;

}


// main entry point with single argument, the object holding our effective configuration
Station.prototype.startListening = function(options) {

  // call fetch explicitly since setInterval waits before the first call.
  this.fetch(options);

  // call the fetch method (bound to 'this' to retain context), passing the
  // options as an argument.
  this.refreshIntervalTimer = setInterval(
    this.fetch.bind(this),
    options.refreshInterval * 1000,
    options
  );

};


Station.prototype.stopListening = function(fetchStatus) {

  // cancel the refreshing
  clearInterval(this.refreshIntervalTimer);

  console.log('Listening stopped.');

  // TODO: refine exit codes based on fetchStatus.
  process.exit(1);

};

module.exports = Station;
