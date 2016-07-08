var Station = require('../station');

module.exports = new Station({
  'name': 'KCRW Eclectic24',
  'homepage': 'http://www.kcrw.com/music/shows/eclectic24',
  'fetch': function(config) {
    console.log('(custom fetch function for KCRW Eclectic24)');
  }
});
