var config = require('./config');
var mongoose = require('mongoose');

// use bluebird promise library for mongoose
mongoose.Promise = require('bluebird');

// mongoose.set('debug', true);

// connect to mongoDB
mongoose.connect(config.MONGODB_URL);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'Error connecting to mongoDB @ ' + config.MONGODB_URL));
conn.once('open', function() {
  console.log('Connected to mongoDB @ ' + config.MONGODB_URL);
});

// app models for exporting
var models = require('./mongoose-models');;

module.exports = {
  conn: conn,
  models: models
};
