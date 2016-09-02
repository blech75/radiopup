var logger = require('../logger');

// load technique cribbed from https://github.com/tsantef/commander-starter/blob/master/commands/index.js
//
var fs = require('fs');
var path = require('path');

module.exports = function(program) {
  var commands = {};
  var loadPath = path.dirname(__filename);

  fs.readdirSync(loadPath).filter(function(filename) {
    return (/\.js$/.test(filename) && filename !== 'index.js');

  }).forEach(function(filename) {
    var name = filename.substr(0, filename.lastIndexOf('.'));
    logger.debug('Loading command: %s...', name);

    // require each file, passing the program object
    commands[name] = require(path.join(loadPath, filename))(program);
  });

  return commands;
};
