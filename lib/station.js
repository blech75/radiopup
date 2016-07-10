// constructor used by all station plugins
function Station(s) {

  // descriptive/proper/human name for the station
  this.name = s.name;

  // URL to stations's homepage (not necessarily the playlist)
  this.homepage = s.homepage;

  // function specific to the station that handles the retrieval of the data
  this.fetch = s.fetch;

  // timer object
  this.fetchInterval = null;

}


// main entry point with single argument: config
Station.prototype.startListening = function(config) {

  // call fetch explicitly since setInterval waits before the first call.
  this.fetch(config);

  // call the fetch method (bound to 'this' to retain context), passing the
  // config as an argument.
  this.fetchInterval = setInterval(
    this.fetch.bind(this),
    config.delay * 1000,
    config
  );

};


Station.prototype.stopListening = function(fetchStatus) {

  // cancel the fetching
  clearInterval(this.fetchInterval);

  console.log('Listening stopped.');

  // TODO: refine exit codes based on fetchStatus.
  process.exit(1);

};

module.exports = Station;
