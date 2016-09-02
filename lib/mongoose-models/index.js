var logger = require('../logger');

// load all of the mongoose models from this dir in one fell swoop. individual
// mongoose models are defined in separate files.

// load technique cribbed from http://stackoverflow.com/a/17204293/2284440
//
// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./' + file);
    logger.debug('Loaded Mongoose model: %s', name);
  }
});
