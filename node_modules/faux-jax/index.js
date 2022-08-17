var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var zlib = require('zlib');

var forEach = require('lodash').forEach;
var Mitm = require('mitm');

function FauxJax() {
  this._installed = false;
}

inherits(FauxJax, EventEmitter);

FauxJax.prototype.install = function(opts) {
  if (opts && opts.gzip) {
    this._gzip = opts.gzip;
  }

  if (this._installed) {
    this.emit('error', new Error('faux-jax: Cannot call `install()` twice. Did you forgot to call `restore()`?'));
    return;
  }

  this._installed = true;

  this._mitm = new Mitm();
  this._mitm.enable();
  this._mitm.on('request', this._newRequest.bind(this));
  this._mitm.on('connect', this._newSocket.bind(this));
};

FauxJax.prototype.restore = function() {
  if (!this._installed) {
    this.emit('error', new Error('faux-jax: Cannot call `restore()` when not installed'));
    return;
  }

  this._stopWaiting();
  this._installed = false;
  this._mitm.disable();
  this.removeAllListeners('request');
  this.emit('restore');
};

FauxJax.prototype.waitFor = function(n, callback) {
  var fj = this;
  var fakeRequests = [];

  this.on('request', waitFor);

  function waitFor(fakeRequest) {
    fakeRequests.push(fakeRequest);
    if (fakeRequests.length === n) {
      fj.removeListener('request', waitFor);
      callback(null, fakeRequests);
    }
  }
};

// specific Node.JS implementation, can be used to
// socket.emit('error') which will then be
FauxJax.prototype._newSocket = function(socket) {
  this.emit('socket', socket);
};

FauxJax.prototype._newRequest = function(req, res) {
  if (this.listeners('request').length === 0) {
    this.emit('error', new Error('faux-jax: received an unexpected request: ' + req.headers.host + req.url));
    return;
  }

  var fj = this;
  var chunks = [];

  var protocol = req.socket.encrypted === true ? 'https:' : 'http:';

  var fakeRequest = new FakeRequest({
    requestMethod: req.method,
    // cannot detect http from https for now,
    // https://github.com/moll/node-mitm/issues/10
    // so we default to http
    requestURL: protocol + '//' + req.headers.host + req.url,
    requestHeaders: req.headers,
    requestBody: null,
    res: res,
    fj: fj,
    gzip: this._gzip
  });

  res.once('finish', function() {
    fj._stopWaiting();
    fakeRequest._clearTimeout();
  });

  req.on('end', function() {
    if (chunks.length > 0) {
      fakeRequest.requestBody = Buffer.concat(chunks).toString();
    }

    // wait for a response, this simulates a timer waiting for a server response
    // not needed in the browser but in nodejs, we need to have it otherwise the process
    // will exits
    fj._wait();

    // this is used to mimick nodejs default READ timeout (2 minutes on Linux)
    fakeRequest._setTimeout(2 * 60 * 1000);

    fj.emit('request', fakeRequest);
  });

  req.on('data', function(chunk) {
    chunks.push(chunk);
  });
};

FauxJax.prototype._wait = function() {
  clearInterval(this._interval);
  this._interval = setInterval(function noop() {}, 20000);
};

FauxJax.prototype._stopWaiting = function() {
  clearInterval(this._interval);
};

function FakeRequest(opts) {
  this._fj = opts.fj;
  this._res = opts.res;
  this.requestMethod = opts.requestMethod;
  this.requestURL = opts.requestURL;
  this.requestHeaders = opts.requestHeaders;
  this.requestBody = opts.requestBody;
  this._gzip = opts.gzip;
}

FakeRequest.prototype.setResponseHeaders = function(headers) {
  var fk = this;
  forEach(headers, function(headerValue, headerName) {
    fk._res.setHeader(headerName, headerValue);
  });
};

FakeRequest.prototype.setResponseBody = function(body, cb) {
  var res = this._res;

  if (this._gzip === true) {
    zlib.gzip(body, write);
    return;
  }

  process.nextTick(function() {
    write(null, body);
  });

  function write(err, bodyToWrite) {
    if (err) {
      throw err;
    }

    if (bodyToWrite !== undefined) {
      res.write(bodyToWrite, cb);
      return;
    }

    cb();
  }
};

FakeRequest.prototype.respond = function(statusCode, headers, body) {
  var res = this._res;
  var fj = this._fj;

  res.statusCode = statusCode;

  if (this._gzip === true) {
    this.setResponseHeaders({'content-encoding': 'gzip'});
  }

  if (headers) {
    this.setResponseHeaders(headers);
  }

  if (body !== undefined) {
    this.setResponseBody(body, end);
    return;
  }

  process.nextTick(end);

  function end() {
    res.end();
    fj.emit('response-end');
    try {
      res.socket.emit('end');
    } catch (e) {
      // empty on purpose, can break in old node.js versions
    }
  }
};

FakeRequest.prototype._setTimeout = function(ms) {
  this._timeout = setTimeout(this._timedout.bind(this), ms);
  this._timeoutListener = this._clearTimeout.bind(this);
  this._fj.once('restore', this._timeoutListener);
  this._fj.once('response-end', this._timeoutListener);
};

FakeRequest.prototype._timedout = function() {
  this.emit('error', new Error('faux-jax: socket hang up'));
};

FakeRequest.prototype._clearTimeout = function() {
  clearTimeout(this._timeout);
  this._fj.removeListener('restore', this._timeoutListener);
  this._fj.removeListener('response-end', this._timeoutListener);
};

module.exports = new FauxJax();
