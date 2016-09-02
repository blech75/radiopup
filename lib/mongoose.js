var mongoose = require('mongoose');

var config = require('./config');
var logger = require('./logger');

// export a function that accepts a single argument: the commander program
// object
module.exports = function(program) {

  // TODO: enable mongoDB debugging via env var or other flag
  mongoose.set('debug', false);

  // use bluebird promise library for mongoose
  mongoose.Promise = require('bluebird');

  mongoose.connect(config.MONGODB_URL, {
    // use bluebird in underlying driver for consistency
    promiseLibrary: mongoose.Promise
  });

  mongoose.connection.on('error', function() {
    logger.error('Error connecting to mongoDB @ ' + config.MONGODB_URL);
  });

  mongoose.connection.on('connected', function() {
    logger.debug('Mongoose default connection state: connected');
  });

  mongoose.connection.once('open', function() {
    logger.debug('Mongoose default connection state: open');

    // now that the DB is ready, emit 'ready' event, which triggers commander
    // to being parsing the cli args and acting on them.
    program.emit('ready');
  });

  mongoose.connection.on('disconnected', function() {
    logger.debug(); // linebreak for ctrl-c
    logger.debug('Mongoose default connection state: disconnected');
  });

  // return a connection object so that
  return mongoose.connection;
};
