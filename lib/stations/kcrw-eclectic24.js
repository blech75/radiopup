var Station = require('../station');

// http://tracklist-api.kcrw.com/Music/all/PAGE_NUM?page_size=PAGE_SIZE

function fetch(config) {
  console.log('(custom fetch function for KCRW Eclectic24)');

  var successfulFetch = false;

  // should fetching fail, this method is responsible for two things: 1)
  // returning a falsey value to its caller, and 2) clearing the interval via
  // a call to it's prototype's stopListening() method. the falsey value is
  // important because the first run of fetch() is not done via
  // setInterval(); the return value is used to determine if the additional
  // calls to fetch via setInterval() should happen.
  //
  if (!successfulFetch) {
    console.log('Error: Fetch failed.');

    // TODO: pass more granular fetch status to stopListening for a more
    // helpful exit code.
    this.stopListening(successfulFetch);
  }

  return successfulFetch;
}

module.exports = new Station({
  'name': 'KCRW Eclectic24',
  'homepage': 'http://www.kcrw.com/music/shows/eclectic24',
  'fetch': fetch
});
