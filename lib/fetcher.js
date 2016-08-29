var _ = require('lodash');

// all station plugins
var stations = require('./station-plugins');

// load default config from filesystem
// FIXME: this should probably just be done once globally, but as of right
// now, the config will be loaded separately in each command defined.
var config = require('./config');

function fetch(station, program) {
  // see if we have a plugin for that station
  var s = stations[station];

  // bail now with exit code if specified station lacks plugin
  if (s === undefined) {
    console.log("Error: Station '%s' is invalid.", station);

    // TODO: exit with meaningful error codes
    process.exit(1);
  }

  console.log('Attempting to request playlist data from %s ...', s.name);

  // merge supplied cli options with defaults to produce our effective options
  var options = {};
  _.merge(options, config, program.opts());

  // if we passed in a delay, acknoweldge it via verbose output.
  if (options.refreshInterval || options.verbose) {
    console.log('Using station data refresh interval of %s second(s).', options.refreshInterval);
  }

  // start listening to the station
  s.startListening(options);
}

module.exports = {
  // export the defaults we're using so cli can display these in help messages.
  defaults: config,

  fetch: fetch
};
