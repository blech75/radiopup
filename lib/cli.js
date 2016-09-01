#!/usr/bin/env node

var program = require('commander');
program.version('0.0.1');


// establish connection to the DB, passing the program object so the mongoose
// module can emit a ready event to kick things off (see below).
var dbConnection = require('./mongoose')(program);


// fetch mode
var fetcher = require('./fetcher');
program
  .command('fetch <station>')
  .alias('f')
  .description('fetches playlist for given station')
  .option('-r, --refresh-interval <interval>', 'Specify station data refresh interval in seconds. (Default: ' + fetcher.defaults.refreshInterval + ')')
  .option('-v, --verbose', 'Enable verbose output for debugging.')
  .option('-R, --range <range>', 'Specify page or date range to import. (Ex: 5..250, 2015-05-15..2015-08-16)', range)
  .option('-P, --page-size <page-size>', 'Specify page size to use. (Default: ' + fetcher.defaults.pageSize + ')')
  .action(fetcher.fetch);


// wait for 'ready' event, which is triggered by mongoose connection open
// event. this avoids race conditions in which the program starts, but the DB
// is not ready yet.
//
// NOTE: revisit this at some point because this means the all arg parsing is
// held up by a database connection. clearly, args like --help shouldn't
// require a DB connection.
//
program.on('ready', function() {
  console.log('Starting app due to "ready" event firing.');
  program.parse(process.argv);
});


// when node receives SIGINT, close the DB connection
// TODO: handle other signals
process.on('SIGINT', function() {
  dbConnection.close(function() {
    console.log('Closing Mongoose default connection due to SIGINT.');
    process.exit(0);
  });
});


// ----

// allows for an arbitrary range separated by two periods.
function range(val) {
  return val.split('..').map(String);
}
