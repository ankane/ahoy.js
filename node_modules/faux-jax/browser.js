var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var XMLHttpRequestMock = require('./lib/XMLHttpRequest/');
var XDomainRequestMock = require('./lib/XDomainRequest/');
var native = require('./lib/native');
var support = require('./lib/support');

function FauxJax() {
  this._installed = false;
}

inherits(FauxJax, EventEmitter);

FauxJax.prototype.install = function() {
  if (this._installed) {
    this.emit('error', new Error('faux-jax: Cannot call `install()` twice. Did you forgot to call `restore()`?'));
    return;
  }

  this._installed = true;

  // only modify the writable state of XMLHttpRequest in old ies when installing
  // it will be done only once
  require('./lib/make-native-implementations-writable')();

  if (this.support.xhr) {
    global.XMLHttpRequest = FakeXHR;
  }

  if (this.support.xdr) {
    global.XDomainRequest = FakeXDR;
  }
};

FauxJax.prototype.restore = function() {
  if (!this._installed) {
    this.emit('error', new Error('faux-jax: Cannot call `restore()` when not installed'));
    return;
  }

  if (support.xhr) {
    global.XMLHttpRequest = native.XMLHttpRequest;
  }

  if (support.xdr) {
    global.XDomainRequest = native.XDomainRequest;
  }

  this.removeAllListeners('request');
  this._installed = false;
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

FauxJax.prototype._newRequest = function(fakeRequest) {
  if (this.listeners('request').length === 0) {
    this.emit('error', new Error('faux-jax: received an unexpected request: ' + fakeRequest.requestURL));
    return;
  }

  this.emit('request', fakeRequest);
};

FauxJax.prototype.support = support;

var fauxJax = new FauxJax();

function FakeXHR() {
  XMLHttpRequestMock.call(this);
}

inherits(FakeXHR, XMLHttpRequestMock);

FakeXHR.prototype.send = function() {
  var req = this;
  XMLHttpRequestMock.prototype.send.apply(req, arguments);
  if (req.async) {
    setTimeout(function() {
      fauxJax._newRequest(req);
    });
  } else {
    fauxJax._newRequest(req);
  }
};

function FakeXDR() {
  XDomainRequestMock.call(this);
}

inherits(FakeXDR, XDomainRequestMock);

FakeXDR.prototype.send = function() {
  var req = this;
  XDomainRequestMock.prototype.send.apply(req, arguments);
  setTimeout(function() {
    fauxJax._newRequest(req);
  });
};

module.exports = fauxJax;
