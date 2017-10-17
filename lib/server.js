var express = require('express');
var router = express.Router();
var app = express();

// establish connection to the DB, passing the express app so the mongoose
// module can emit a ready event to kick things off (see below).
var mongoose = require('./mongoose')(app);

// initialize the logging system
var logger = require('./logger');

var graphql = require('graphql').graphql;
var bodyParser = require('body-parser');
var apolloServer = require('apollo-server-express');
var graphqlExpress = apolloServer.graphqlExpress;
var graphiqlExpress = apolloServer.graphiqlExpress;

var port = process.env.PORT || 8080;

var schema = require('./schema');


// register an event listener for when program defaults (in config file) have
// been merged with runtime options
app.on('optionsMerged', function(options) {
  var newLogLevel = options.logLevel;
  logger.level = newLogLevel;
  logger.debug('Logger reconfigured with logLevel: ' + newLogLevel);
});


// register a 'dbReady' event on the program which will be triggered from
// the mongoose connection open event.
app.on('dbReady', function dbreadyListenerHandler() {
  logger.debug('dbReady event fired');
  
  app.use('/graphql',
    bodyParser.json(),
    graphqlExpress({ schema: schema })
  );

  app.get('/graphiql', 
    graphiqlExpress({ endpointURL: '/graphql' })
  );
  
  app.listen(port);
  console.log('server ready and listening on port ' + port + '...');
});


// handle normal exiting and various signals:
//
// * the shell sends SIGINT on ctrl-c
// * heroku sends SIGTERM when dynos are restarted.
//
['beforeExit', 'SIGINT', 'SIGTERM'].forEach(function(signal) {
  process.on(signal, closeDbConnectionAndExit);
});

// does what it says on the tin
function closeDbConnectionAndExit() {
  mongoose.callbacks.closeConnectionOnExit()
    .then(function() { process.exit(0); });
}
