#!/usr/bin/env node

var program = require('commander');

// sync program version with npm package version
var packageJson = require('../package.json');
program.version(packageJson.version);

// initialize the logging system
var logger = require('./logger');


// establish connection to the DB, passing the program object so the mongoose
// module can emit a ready event to kick things off (see below).
var dbConnection = require('./mongoose')(program);


// load all commands in one fell swoop passing the program object so each
// command can register itself, etc.
var commands = require('./commands')(program);


// wait for 'ready' event, which is triggered by mongoose connection open
// event. this avoids race conditions in which the program starts, but the DB
// is not ready yet.
//
// NOTE: revisit this at some point because this means the all arg parsing is
// held up by a database connection. clearly, args like --help shouldn't
// require a DB connection.
//
program.on('ready', function() {
  logger.debug('Starting app due to "ready" event firing.');
  program.parse(process.argv);
});


// when node receives SIGINT, close the DB connection
// TODO: handle other signals
process.on('SIGINT', function() {
  dbConnection.close(function() {
    logger.debug('Closing Mongoose default connection due to SIGINT.');
    process.exit(0);
  });
});
