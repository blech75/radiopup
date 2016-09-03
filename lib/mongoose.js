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

  mongoose.connect(config.MONGODB_URI, {
    // use bluebird in underlying driver for consistency
    promiseLibrary: mongoose.Promise
  });

  mongoose.connection.on('error', function() {
    logger.error('Error connecting to mongoDB @ ' + config.MONGODB_URI);
  });

  mongoose.connection.on('connected', function() {
    logger.debug('Mongoose default connection state: connected');
  });

  mongoose.connection.once('open', function() {
    logger.debug('Mongoose default connection state: open');

    // now that the DB is ready, emit 'dbReady' event so commands know it's
    // safe to proceed
    program.emit('dbReady');
  });

  mongoose.connection.on('disconnected', function() {
    logger.debug(); // linebreak for ctrl-c
    logger.debug('Mongoose default connection state: disconnected');
  });


  function closeConnectionOnExit() {
    // 'close' returns a promise, so we need to resolve it in the calling function
    return mongoose.connection.close(function() {
      logger.debug('Closing Mongoose default connection due to SIGINT.');
    });
  }

  return {
    connection: mongoose.connection,
    callbacks: {
      closeConnectionOnExit: closeConnectionOnExit
    }
  };
};
