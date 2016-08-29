#!/usr/bin/env node

var program = require('commander');
var fetcher = require('./fetcher');

program.version('0.0.1');

program
  .command('fetch <station>')
  .alias('f')
  .description('fetches playlist for given station')
  .option('-r, --refresh-interval <interval>', 'Specify station data refresh interval in seconds. (Default: ' + fetcher.defaults.refreshInterval + ')')
  .option('-v, --verbose', 'Enable verbose output for debugging.')
  .action(fetcher.fetch);

program.parse(process.argv);
