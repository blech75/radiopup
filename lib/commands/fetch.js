var _ = require('lodash');

// load default config from filesystem
var defaults = require('../config');

var logger = require('../logger');

var Station = require('../station');

// all station plugins
var stations = require('../station-plugins');


// allows for an arbitrary range separated by two periods.
function range(val) {
  return val.split('..').map(String);
}


module.exports = function(program) {

  // NOTE: the following three variables (dbReadyFlag, station, options) are
  // accessed and modifed by the two event handlers and the fetch function.
  // this is less than ideal, but allows for coordination amongst the async
  // processes (commander arg parsing and db init'ing).
  //
  // boolean flag that signifies the DB is ready, which means we can proceed
  var dbReadyFlag = false;
  //
  // Station object that we are listening to
  var station = null;
  //
  // runtime options
  var options = {};


  // configure the fetch command
  program
    .command('fetch <station>')
    .alias('f')
    .description('fetches playlist for given station')
    // NOTE: commander does not allow for 'global' arguments, so we need to
    // define a log-level option in each command.
    .option('-L, --log-level <level>', 'Specify the minimum log level (one of: error, warn, info, verbose, debug, silly). Default: ' + defaults.logLevel)
    .option('-r, --refresh-interval <interval>', 'Specify station data refresh interval in seconds. (Default: ' + defaults.refreshInterval + ')')
    .option('-R, --range <range>', 'Specify page or date range to import. (Ex: 5..250, 2015-05-15..2015-08-16)', range)
    .option('-P, --page-size <page-size>', 'Specify page size to use. (Default: ' + defaults.pageSize + ')')
    .option('-O, --one-shot', 'Quit after first request/response.')
    .action(fetch);


  // register a 'dbReady' event on the program which will be triggered from
  // the mongoose connection open event.
  program.on('dbReady', function dbreadyListenerHandler() {
    logger.debug('dbReady event fired');

    // flip the flag to signify the db is ready
    dbReadyFlag = true;

    // attempt to start listening
    program.emit('startListening');
  });

  // register a startListening event which is triggered by both the dbready
  // event and the main fetch method.
  program.on('startListening', function startListeningListener() {
    logger.debug('startListening event fired');

    // only start listening if both the station is configured and the DB is
    // ready. this avoids race conditions between the DB and commander's
    // parsing of its arguments.
    if (station && station instanceof Station && dbReadyFlag) {
      station.startListening(options);
    } else {
      logger.info('Hold on, things are not quite ready yet. dbReadyFlag=' + dbReadyFlag.toString() + ', ' + (station && station.name));
    }
  });

  // main entry point called from commander as the action. accepts two
  // arguments: the stationName (from command line arg) and the commander
  // program object.
  function fetch(stationName, program) {

    // merge supplied cli options with defaults to produce our effective
    // options
    _.merge(options, defaults, program.opts());

    // pass the effective options to our parent program via the optionsMerged
    // event
    program.parent.emit('optionsMerged', options);

    // look up station plugin
    station = stations[stationName];

    // bail now with exit code if specified station lacks plugin
    if (station === undefined) {
      logger.warn("Error: Station '%s' is invalid.", stationName);

      // TODO: exit with meaningful error codes
      process.exit(1);
    }

    logger.info('Requesting playlist for %s...', station.name);

    if (options.refreshInterval) {
      logger.info('Using station data refresh interval of %s second(s).', options.refreshInterval);
    }

    // we're done here. hand things over to the startListening event
    program.emit('startListening');
  }

  // TODO: consider the retutn value for this module.export function.
};
