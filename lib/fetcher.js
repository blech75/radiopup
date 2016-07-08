var _ = require('lodash');

// all station plugins
var stations = require('./stations');

var DEFAULTS = {
  // fetch delay, in seconds
  'delay': 15,

  // logging mode
  'verbose': false
};

function fetch(station, options) {
  var config = _.merge(DEFAULTS, options);

  // look up the specified station
  var s = stations[station];

  // bail now with exit code if specified station lacks plugin
  if (s === undefined) {
    console.log("Error: Station '%s' is invalid.", station);

    // TODO: exit with meaningful error codes
    process.exit(1);
  }

  console.log('Attempting to request playlist data from %s ...', s.name);

  // if we passed in a delay, acknoweldge it via verbose output.
  if (options.delay || config.verbose) {
    console.log('Using %s second delay between requests.', config.delay);
  }

  // call the fetch method and pass the config to it.
  s.fetch(config);
}

module.exports = {
  defaults: DEFAULTS,
  fetch: fetch
};
