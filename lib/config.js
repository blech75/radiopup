// to simplify things, this object holds all config elements and will be
// merged with the supplied cli arguments.
module.exports = {
  // HTTP request throttle delay for station data refreshes (in seconds).
  // avoid single-digit numbers to be a good neighbor.
  'refreshInterval': 15,

  // logging mode
  'verbose': false

};
