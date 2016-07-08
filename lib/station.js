// constructor used by all station plugins
function Station(s) {

  // descriptive/proper name for the station
  this.name = s.name;

  // URL to stations's homepage (not necessarily the playlist)
  this.homepage = s.homepage;

  // main entry point with single argument: the config.
  this.fetch = s.fetch;

}

module.exports = Station;
