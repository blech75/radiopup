var logger = require('../logger');

// load all of the mongoose models from this dir in one fell swoop. individual
// mongoose models are defined in separate files.

// load technique cribbed from http://stackoverflow.com/a/17204293/2284440
// and combined with cross-platform friendliness of
// https://github.com/tsantef/commander-starter/blob/master/commands/index.js
//
// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
var fs = require('fs');
var path = require('path');
var loadPath = path.dirname(__filename);

fs.readdirSync(loadPath).filter(function(filename) {
  return (/\.js$/.test(filename) && filename !== 'index.js');
}).forEach(function(filename) {
  var name = filename.substr(0, filename.lastIndexOf('.'));
  exports[name] = require(path.join(loadPath, filename));
  logger.debug('Loaded Mongoose model: %s', name);
});
