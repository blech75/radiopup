# TODO

Organized by effort, in rough priority/importance order.


### Low-hanging fruit / Straightforward

* add optional file transport for logger that outputs log level + timestamp, new file for each run.
* change HTTP UA
* make require order consistent (external modules then local modules)
* clean up internal terminology/nomenclature (tracks, songs, tracklist)
* add editorconfig, etc.
* add npm dependency check tool
* lock versions of external dependencies (mongodb)
* rename project
* add readme / requirements
* investigate proper npm packaging/versioning/releasing


### A bit more involved / Potentially a bit tricky

* extend data normalization rules to allow for extensive recipes
  * clean up album titles (remove 'Disc x of y', etc.)
  * address charset issues
* implement '--limit' argument to fetch (stop after x number of items)
* proper error handling and exit codes
* add external persistent queues
  * mongodb? redis? ...?
  * 'fetchQueue' command mode to operate as a worker
  * 'addToQueue' command mode to add to external queue
  * 'queueStatus' command mode to report on status
  * HTTP API interface for adding to queues, status, etc.
* station plugin for WBGO (needs: HTML parsing, date range support, data normalization)


### Random, etc.

* timezone math via moment.js
* learn more about mongoDB best practices (index, profiling, etc.)
* ES6 syntax


### Not yet a fully-formed idea / Needs some planning & thought

* schema validation
* add tests w/ HTTP request mocking
* searching/reporting (CLI interface, HTTP API, front-end client, etc.)
* metadata retrieval scheme
* database migration
* dockerize
* consider normalizing (unflatten) data model
