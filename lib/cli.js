#!/usr/bin/env node

var program = require('commander');

// sync program version with npm package version
var packageJson = require('../package.json');
program.version(packageJson.version);

// initialize the logging system
var logger = require('./logger');


// establish connection to the DB, passing the program object so the mongoose
// module can emit a ready event to kick things off (see below).
var mongoose = require('./mongoose')(program);

// register all commands in one fell swoop passing the program object so each
// command can register itself, etc.
var commands = require('./commands')(program);


// when node receives SIGINT, close the DB connection
// TODO: handle other signals
process.on('SIGINT', function() {
  mongoose.callbacks.closeConnectionOnExit()
    .then(function() { process.exit(0); });
});


// parse args and kick off program.
program.parse(process.argv);
