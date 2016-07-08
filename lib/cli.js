#!/usr/bin/env node

var program = require('commander');
var fetcher = require('./fetcher');

program.version('0.0.1');

program
  .command('fetch <station>')
  .alias('f')
  .description('fetches playlist for given station')
  .option('-d, --delay <delay>', 'Specify delay in seconds to be used when refreshing data. (Default: 15)')
  .option('-v, --verbose', 'Enable verbose output for debugging.')
  .action(fetcher);

program.parse(process.argv);
