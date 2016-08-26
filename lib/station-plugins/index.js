// load all of the station plugins from this dir in one fell swoop. individual
// station plugins are defined in separate files and should all be instances
// of the Station class, defined in the parent directory.

// load technique cribbed from http://stackoverflow.com/a/17204293/2284440
//
// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./' + file);
    console.log('Loaded station plugin: %s', name);
  }
});
