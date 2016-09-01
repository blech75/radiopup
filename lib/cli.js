#!/usr/bin/env node

var program = require('commander');
var fetcher = require('./fetcher');

// allows for an arbitrary range separated by two periods.
function range(val) {
  return val.split('..').map(String);
}

program.version('0.0.1');

program
  .command('fetch <station>')
  .alias('f')
  .description('fetches playlist for given station')
  .option('-r, --refresh-interval <interval>', 'Specify station data refresh interval in seconds. (Default: ' + fetcher.defaults.refreshInterval + ')')
  .option('-v, --verbose', 'Enable verbose output for debugging.')
  .option('-R, --range <range>', 'Specify page or date range to import. (Ex: 5..250, 2015-05-15..2015-08-16)', range)
  .option('-P, --page-size <page-size>', 'Specify page size to use. (Default: ' + fetcher.defaults.pageSize + ')')
  .action(fetcher.fetch);

program.parse(process.argv);
