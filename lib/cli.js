#!/usr/bin/env node

var program = require('commander');
var fetcher = require('./fetcher');

program.version('0.0.1');

program
  .command('fetch <station>')
  .alias('f')
  .description('fetches playlist for given station')
  .action(fetcher);

program.parse(process.argv);
