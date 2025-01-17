#!/usr/bin/env node

var program = require('commander');

// sync program version with npm package version
var packageJson = require('../package.json');
program.version(packageJson.version);

// initialize the logging system
var logger = require('./logger');

// register an event listener for when program defaults (in config file) have
// been merged with runtime options
program.on('optionsMerged', function(options) {
  var newLogLevel = options.logLevel;
  logger.level = newLogLevel;
  logger.debug('Logger reconfigured with logLevel: ' + newLogLevel);
});


// establish connection to the DB, passing the program object so the mongoose
// module can emit a ready event to kick things off (see below).
var mongoose = require('./mongoose')(program);

// register all commands in one fell swoop passing the program object so each
// command can register itself, etc.
var commands = require('./commands')(program);


// handle normal exiting and various signals:
//
// * the shell sends SIGINT on ctrl-c
// * heroku sends SIGTERM when dynos are restarted.
//
['beforeExit', 'SIGINT', 'SIGTERM'].forEach(function(signal) {
  process.on(signal, closeDbConnectionAndExit);
})

// does what it says on the tin
function closeDbConnectionAndExit() {
  mongoose.callbacks.closeConnectionOnExit()
    .then(function() { process.exit(0); });
}


// parse args and kick off program.
program.parse(process.argv);
