module.exports = XMLHttpRequest;

var assign = require('lodash-compat/object/assign');
var inherits = require('util').inherits;

var Event = require('../Event');
var EventTarget = require('../EventTarget')();

var events = require('./events');
var forbiddenHeaderNames = require('./forbidden-header-names');
var forbiddenMethods = require('./forbidden-methods');
var httpStatusCodes = require('./http-status-codes');
var native = require('../native');
var methods = require('./methods');
var states = require('./states');
var support = require('../support');

// https://xhr.spec.whatwg.org/#constructors
function XMLHttpRequest() {
  EventTarget.call(this, events);

  this.readyState;

  if (support.xhr.timeout) {
    this.timeout = 0;
  }

  if (support.xhr.cors) {
    this.withCredentials = false;
  }

  this.upload;
  this.responseType = '';
  this.responseText = '';
  this.responseXML = null;
  this.readyState = states.UNSENT;

  if (support.xhr.response) {
    this.response = '';
  }

  if (support.xhr.responseURL) {
    this.responseURL = '';
  }

  this.status = 0;
  this.statusText = '';
}

inherits(XMLHttpRequest, EventTarget);

// https://xhr.spec.whatwg.org/#the-open()-method
XMLHttpRequest.prototype.open = function(method, url, async, username, password) {
  var indexOf = require('lodash-compat/array/indexOf');

  if (typeof method !== 'string') {
    throw new SyntaxError('Invalid method');
  }

  var normalizedMethod = method.toUpperCase();

  if (indexOf(methods, normalizedMethod) === -1 &&
    indexOf(forbiddenMethods, normalizedMethod) !== -1 &&
    method !== normalizedMethod) {
    throw new Error('SecurityError');
  }

  if (indexOf(methods, normalizedMethod) === -1 &&
    indexOf(forbiddenMethods, method) === -1) {
    throw new SyntaxError('Invalid method');
  }

  // fauxJax's specific API
  this.requestMethod = normalizedMethod;
  this.requestURL = url;

  if (typeof async === 'boolean') {
    this.async = async;
  } else {
    this.async = true;
  }

  // we keep separate stores for headers,
  // headers are case insensitive (http://tools.ietf.org/html/rfc7230#section-3.2)
  // but current browser implementations will not normalize them over the wire, we mimic this
  // 1. know if a particular header is set, get his provided name from his lowercased name
  this._headerNames = {};
  // 2. stores the provided header => value
  this.requestHeaders = {};

  this.username = username;
  this.password = password;

  readyStateChange(this, states.OPENED);
};

// https://xhr.spec.whatwg.org/#dom-xmlhttprequest-setrequestheader
XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
  var indexOf = require('lodash-compat/array/indexOf');

  if (this.readyState !== states.OPENED) {
    throw new Error('InvalidStateError');
  }

  if (this.sendFlag === true) {
    throw new Error('InvalidStateError');
  }

  if (!name || value === undefined) {
    throw new SyntaxError('Missing name or value');
  }

  if (indexOf(forbiddenHeaderNames, name) !== -1) {
    throw new Error('Refused to set unsafe header "' + name + '"');
  }

  var lowerCasedHeaderName = name.toLowerCase();

  // only register a header once, first call sets the case
  if (this._headerNames[lowerCasedHeaderName] === undefined) {
    this._headerNames[lowerCasedHeaderName] = name;
  }

  var originalHeaderNameCase = this._headerNames[lowerCasedHeaderName];

  if (this.requestHeaders[originalHeaderNameCase] === undefined) {
    this.requestHeaders[originalHeaderNameCase] = value;
  } else {
    this.requestHeaders[originalHeaderNameCase] = this.requestHeaders[originalHeaderNameCase] + ', ' + value;
  }
};

// https://xhr.spec.whatwg.org/#dom-xmlhttprequest-send
XMLHttpRequest.prototype.send = function(body) {
  if (this.readyState !== states.OPENED) {
    throw new Error('InvalidStateError');
  }

  if (this.sendFlag === true) {
    throw new Error('InvalidStateError');
  }

  if (support.xhr.timeout) {
    this._setTimeoutIfNecessary();
  }

  if (this.requestMethod === 'GET' || this.requestMethod === 'HEAD') {
    this.requestBody = null;
  } else {
    this.requestBody = body;
  }

  if (this.requestBody && this._headerNames['content-type'] === undefined) {
    this.requestHeaders['Content-Type'] = 'text-plain;charset=UTF-8';
  }

  this.sendFlag = true;

  if (support.xhr.events.loadstart) {
    dispatchProgressEvent(this, {
      type: 'loadstart',
      total: 0,
      loaded: 0,
      lengthComputable: false
    });
  }
};

// https://xhr.spec.whatwg.org/#the-abort()-method
XMLHttpRequest.prototype.abort = function() {
  if (this.readyState > states.UNSENT && this.sendFlag === true) {
    if (support.xhr.response) {
      this.response = new Error('NetworkError');
    }

    handleRequestError(this, 'abort');

    return;
  }

  this.responseType = '';
  this.responseText = '';
  this.responseXML = null;
  this.readyState = states.UNSENT;

  if (support.xhr.response) {
    this.response = '';
  }

  if (support.xhr.responseURL) {
    this.responseURL = '';
  }

  this.status = 0;
  this.statusText = '';

  if (support.xhr.timeout) {
    this.timeout = 0;
  }
};

// https://xhr.spec.whatwg.org/#the-getresponseheader()-method
XMLHttpRequest.prototype.getResponseHeader = function(headerName) {
  headerName = headerName.toLowerCase();

  for (var responseHeaderName in this.responseHeaders) {
    if (responseHeaderName.toLowerCase() === headerName) {
      return this.responseHeaders[responseHeaderName];
    }
  }

  return null;
};

if (support.xhr.getAllResponseHeaders) {
  // https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
  XMLHttpRequest.prototype.getAllResponseHeaders = function() {
    var reduce = require('lodash-compat/collection/reduce');

    if (!this.responseHeaders) {
      return '';
    }

    function formatHeader(headers, headerValue, headerName) {
      return headers + headerName + ': ' + headerValue + '\r\n';
    }

    return reduce(this.responseHeaders, formatHeader, '');
  };
}

// now onto fauxJax's specific API
XMLHttpRequest.prototype.setResponseHeaders = function(headers) {
  if (this.readyState === states.DONE) {
    return;
  }

  var clone = require('lodash-compat/lang/clone');

  if (!headers) {
    throw new Error('Please specify at least one header when using xhr.setResponseHeaders()');
  }

  if (this.readyState < states.OPENED || this.sendFlag !== true) {
    throw new Error('Call xhr.open() and xhr.send() before using xhr.setResponseHeaders()');
  }

  this.responseHeaders = clone(headers);

  readyStateChange(this, states.HEADERS_RECEIVED);
};

XMLHttpRequest.prototype.setResponseBody = function(body) {
  if (this.readyState === states.DONE) {
    return;
  }

  var xhr = this;
  var forEach = require('lodash-compat/collection/forEach');

  if (typeof body !== 'string') {
    throw new Error('xhr.setResponseBody() expects a String');
  }

  if (this.readyState < states.HEADERS_RECEIVED || this.sendFlag !== true) {
    throw new Error('Call xhr.open(), xhr.send() and xhr.setResponseHeaders() before using xhr.setResponseBody()');
  }

  var lengthComputable = this.getResponseHeader('Content-Length') === undefined ? false : true;

  var chunkSize = 10;
  var index = 0;

  while (index < body.length) {
    this.responseText += body.slice(index, index + chunkSize);
    index += chunkSize;
    readyStateChange(this, states.LOADING);
    if (support.xhr.events.progress) {
      dispatchProgressEvent(this, {
        type: 'progress',
        total: this.getResponseHeader('Content-Length') || 0,
        loaded: index,
        lengthComputable: lengthComputable
      });
    }
  }

  if (support.xhr.response) {
    if (this.responseType === 'json') {
      this.response = JSON.parse(this.responseText);
    } else {
      this.response = this.responseText;
    }
  }

  if (support.xhr.responseURL) {
    var url = require('url');
    // https://xhr.spec.whatwg.org/#the-responseurl-attribute
    var responseURL = url.parse(url.resolve(location.href, this.requestURL));
    delete responseURL.hash;
    this.responseURL = url.format(responseURL);
  }

  if (this._timeoutID) {
    clearTimeout(this._timeoutID);
  }

  readyStateChange(this, states.DONE);

  forEach(['progress', 'load', 'loadend'], function progress(eventName) {
    if (support.xhr.events[eventName]) {
      dispatchProgressEvent(xhr, {
        type: eventName,
        total: xhr.getResponseHeader('Content-Length') || 0,
        loaded: index,
        lengthComputable: lengthComputable
      });
    }
  });
};

XMLHttpRequest.prototype.respond = function(statusCode, headers, body) {
  if (this.readyState === states.DONE) {
    return;
  }

  this.status = statusCode;
  this.statusText = httpStatusCodes[this.status];

  if (headers) {
    this.setResponseHeaders(headers);
  }

  if (body !== undefined) {
    this.setResponseBody(body);
  }
};

XMLHttpRequest.prototype._setTimeoutIfNecessary = function() {
  var bind = require('lodash-compat/function/bind');
  if (this.timeout > 0 && this._timeoutID === undefined) {
    this._timeoutID = setTimeout(bind(handleRequestError, null, this, 'timeout'), this.timeout);
  }
};

// set XMLHttpRequest.UNSENT etc. like browsers does it
// console.log(XMLHttpRequest.UNSENT), console.log(XMLHttpRequest.prototype.UNSENT)
if (native.XMLHttpRequest && native.XMLHttpRequest.OPENED) {
  assign(XMLHttpRequest, states);
  assign(XMLHttpRequest.prototype, states);
}

function dispatchEvent(eventTarget, type, params) {
  params = params || {};

  var event = new Event(type, {
    bubbles: params.bubbles,
    cancelable: params.cancelable
  });

  event.target = eventTarget;
  event.currentTarget = eventTarget;

  assign(event, params);

  eventTarget.dispatchEvent(event);
}

function readyStateChange(eventTarget, readyState) {
  eventTarget.readyState = readyState;

  dispatchEvent(eventTarget, 'readystatechange', {
    bubbles: false,
    cancelable: false
  });
}

// https://xhr.spec.whatwg.org/#handle-errors
// https://xhr.spec.whatwg.org/#request-error-steps
function handleRequestError(eventTarget, type) {
  readyStateChange(eventTarget, states.DONE);

  dispatchProgressEvent(eventTarget, {
    type: 'progress',
    total: 0,
    loaded: 0,
    lengthComputable: false
  });

  dispatchProgressEvent(eventTarget, {
    type: type,
    total: 0,
    loaded: 0,
    lengthComputable: false
  });

  dispatchProgressEvent(eventTarget, {
    type: 'loadend',
    total: 0,
    loaded: 0,
    lengthComputable: false
  });
}

function dispatchProgressEvent(eventTarget, progressParams) {
  dispatchEvent(eventTarget, progressParams.type, {
    // deprecated https://codereview.chromium.org/492213004
    totalSize: progressParams.total,
    total: progressParams.total,
    loaded: progressParams.loaded,
    // deprecated https://codereview.chromium.org/492213004
    position: progressParams.loaded,
    lengthComputable: progressParams.lengthComputable,
    bubbles: false,
    cancelable: false
  });
}
