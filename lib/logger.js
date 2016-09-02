var winston = require('winston');

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      // TODO: enable verbose/debug logging via cli argument/config
      level: 'info',
      colorize: true,
      showLevel: false,
      stderrLevels: ['error', 'debug'] // default
    })
  ]
});

module.exports = logger;
