var _ = require('lodash');

var DEFAULTS = {
  // fetch delay, in seconds
  'delay': 15,

  // logging mode
  'verbose': false
};

function fetch(station, options) {
  var config = _.merge(DEFAULTS, options);

  console.log('Fetching station: %s ...', station);

  // if we passed in a delay, acknoweldge it via verbose output.
  if (options.delay || config.verbose) {
    console.log('Using %s second delay between requests.', config.delay);
  }

}

module.exports = fetch;
