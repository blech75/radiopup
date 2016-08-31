// to simplify things, this object holds all config elements and will be
// merged with the supplied cli arguments.
module.exports = {
  // TODO: accept via env var
  'MONGODB_URL': 'mongodb://localhost/radiopup',

  // HTTP request throttle delay for station data refreshes (in seconds).
  // avoid single-digit numbers to be a good neighbor.
  'refreshInterval': 15,

  // logging mode
  'verbose': false

};
