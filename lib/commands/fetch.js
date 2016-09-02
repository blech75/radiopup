var _ = require('lodash');

// load default config from filesystem
var defaults = require('../config');

var logger = require('../logger');

// all station plugins
var stations = require('../station-plugins');


// allows for an arbitrary range separated by two periods.
function range(val) {
  return val.split('..').map(String);
}


module.exports = function(program) {

  program
    .command('fetch <station>')
    .alias('f')
    .description('fetches playlist for given station')
    .option('-r, --refresh-interval <interval>', 'Specify station data refresh interval in seconds. (Default: ' + defaults.refreshInterval + ')')
    // TODO: the --verbose options should really be part a main program option
    .option('-v, --verbose', 'Enable verbose output for debugging.')
    .option('-R, --range <range>', 'Specify page or date range to import. (Ex: 5..250, 2015-05-15..2015-08-16)', range)
    .option('-P, --page-size <page-size>', 'Specify page size to use. (Default: ' + defaults.pageSize + ')')
    .action(fetch);


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
    var options = {};
    _.merge(options, defaults, program.opts());

    // if we passed in a refresh interval, acknoweldge it via verbose output.
    if (options.refreshInterval || options.verbose) {
      // TODO: change to logger.verbose once we configure log level dynamically
      logger.info('Using station data refresh interval of %s second(s).', options.refreshInterval);
    }

    // start listening to the station
    s.startListening(options);
  }

  // TODO: consider what value this should return, if any at all.

};
