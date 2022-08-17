# 5.0.4 (2016-08-30)

# 5.0.3 (2016-08-30)

# 5.0.2 (2016-08-30)

# 5.0.1 (2016-02-29)

* fix(listeners): do not leak listeners on response end

# 5.0.0 (2016-02-20)

* fix(nodejs): emit end after ending response, not before fixes #11
* fix(XHR spec): handle sync XHRS
* fix(XHR spec): new request event is now only on send call, always async if no sync flag

# 4.2.1 (2015-12-08)

  * fix(0.10): fix gzip option in node 0.10

# 4.2.0 (2015-12-06)

  * feat(res): provide gzip option in install({gzip:true})

# 4.1.0 (2015-09-01)

  * fix: iojs fix by upgrading mitm

# 4.0.0 (2015-05-24)

  * event driven and nodejs support out of beta: it works
  * handle https: protocol in node.js

# 4.0.0-beta.2 (2015-04-07)

  * keep the event loop alive in Node.js

# 4.0.0-beta.1 (2015-04-02)

  * BREAKING CHANGE: faux-jax is now asyncrhonous by default, there's no more `.requests` property on the `fauxJax` object
    Now you need to: fauxJax.on('request', function(err, request) {})
    This was done while adding the Node.js compatibility and also because asynchronous requests (XHRS, Node.js http) ARE A-S-Y-N-C-H-R-O-N-O-U-S
  * FEATURE: Node.js compatibility, you can now intercept both on the browser and the server

# 3.0.1 (2015-03-10)

  * upgrade lodash to 3.5.0
  * upgrade writable-window-method to 1.0.3

# 3.0.0 (2015-03-07)

  * fix `getAllResponseHeaders()` implementation, returns a string, not an array

# 2.0.0 (2015-03-06)

  * tune XDomainRequest mock. No eventObject for IE8 in event listeners
  * no eventObject in progress events on all browsers when XDomainRequest

# 1.7.1 (2015-03-04)

  * throw when calling `fauxJax.install()` twice

# 1.7.0 (2015-03-04)

  * do not allow `.respond()` `.setResponseHeaders()` `.setResponseBody` when request timeout or error

# 1.6.0 (2015-02-26)

  * enhance XDomainRequest implem
  * use writable-window-method

# 1.5.1 (2015-02-25)

  * no more modifying the environment before any call to `fauxJax.install()`

# 1.5.0 (2015-02-25)

  * expose support flags through `fauxJax.support`

# 1.4.0 (2015-02-23)

  * do not force a Content-Type if body is null
  * do not force a charset if none set

# 1.3.0 (2015-02-16)

  * do not duplicate content-type header if case does not matches
  * setRequestHeader() compare header names in a case insensitive
  * setRequestHeader() appends header values

# 1.2.0 (2015-02-14)

  * better progress events
  * more feature detection, closer to native environment

# 1.1.0 (2015-02-13)

  * add IE7/8 compatiblity
  * add more feature detection (events, like onload not on IE7)
  * remove IE6 testing, there will be no compatibility
  * do not use deepEqual from tape on IE7/8, fails

# 1.0.2 (2015-02-12)

  * fix .install() when using XDomainRequest
  * tests ok on IE9
  * ISC => MIT

# 1.0.1 (2015-02-12)

  * [XDomainRequest](https://msdn.microsoft.com/en-us/library/ie/cc288060(v=vs.85).aspx) implementation

# 1.0.0 (2015-02-11)

  * initial
