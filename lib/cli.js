#!/usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .command('fetch [station]', 'fetches station')
  .parse(process.argv);
