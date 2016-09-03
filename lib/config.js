// to simplify things, this object holds all config elements and will be
// merged with the supplied cli arguments.
module.exports = {
  'MONGODB_URI': process.env['MONGODB_URI'] || "mongodb://localhost/radiopup",

  // HTTP request throttle delay for station data refreshes (in seconds).
  // avoid single-digit numbers to be a good neighbor.
  'refreshInterval': 15,

  // number of items returned in each request, for stations that accommodate
  // such a parameter.
  'pageSize': 25,

  // specify the log level. one of: error, warn, info, verbose, debug, silly.
  // normal output occurs at 'info' level.
  'logLevel': 'info'

};
