var _ = require('lodash');

// load default config from filesystem
// TODO: this should probably just be done once globally, but as of right
// now, the config will be loaded separately in each command defined.
var config = require('./config');

var logger = require('./logger');

// all station plugins
var stations = require('./station-plugins');

function fetch(station, program) {
  // see if we have a plugin for that station
  var s = stations[station];

  // bail now with exit code if specified station lacks plugin
  if (s === undefined) {
    logger.warn("Error: Station '%s' is invalid.", station);

    // TODO: exit with meaningful error codes
    process.exit(1);
  }

  logger.info('Attempting to request playlist data from %s ...', s.name);

  // merge supplied cli options with defaults to produce our effective options
  // TODO: we should probably avoid passing this around and just reference it
  // in once place. not sure where, though.
  var options = {};
  _.merge(options, config, program.opts());

  // if we passed in a refresh interval, acknoweldge it via verbose output.
  if (options.refreshInterval || options.verbose) {
    // TODO: change to logger.verbose once we configure log level dynamically
    logger.info('Using station data refresh interval of %s second(s).', options.refreshInterval);
  }

  // start listening to the station
  s.startListening(options);
}

module.exports = {
  // export the defaults we're using so cli can display these in help messages.
  defaults: config,

  fetch: fetch
};
