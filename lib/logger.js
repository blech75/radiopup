var winston = require('winston');

var config = require('./config');

var logger = new winston.Logger({
  // NOTE: level is updated once cmdline arguments are parsed. see the
  // optionsMerged event handler.
  level: config.logLevel,
  transports: [
    new winston.transports.Console({
      colorize: true,
      showLevel: false,
      stderrLevels: ['error', 'debug'] // default
    })
  ]
});

module.exports = logger;
