var browser = require('bowser');

var hasXMLHttpRequest = 'XMLHttpRequest' in global;
var hasXDomainRequest = 'XDomainRequest' in global;

var support = module.exports = {};

if (hasXMLHttpRequest) {
  var xhr = new XMLHttpRequest();
  support.xhr = {};

  support.xhr.getAllResponseHeaders = 'getAllResponseHeaders' in xhr;
  support.xhr.response = 'response' in xhr;
  support.xhr.cors = 'withCredentials' in xhr;
  support.xhr.timeout = 'timeout' in xhr;
  support.xhr.addEventListener = 'addEventListener' in xhr;
  support.xhr.responseURL = 'responseURL' in xhr;

  support.xhr.events = {};
  support.xhr.events.loadstart = 'onloadstart' in xhr;
  support.xhr.events.progress = 'onprogress' in xhr;
  support.xhr.events.abort = 'onabort' in xhr;
  support.xhr.events.error = 'onerror' in xhr;
  support.xhr.events.load = 'onload' in xhr;
  support.xhr.events.timeout = 'ontimeout' in xhr;
  support.xhr.events.loadend = 'onloadend' in xhr;
  support.xhr.events.readystatechange = 'onreadystatechange' in xhr;
}

if (hasXDomainRequest) {
  support.xdr = {};

  // XDomainRequest implementations are using the same set of features
  // Only difference is that IE8 does not sends `event` objects in event listeners
  // And other browsers never sends `event` objects in `progress` listener

  if (browser.msie && browser.version === '8.0') {
    support.xdr.eventObjects = [];
  } else {
    support.xdr.eventObjects = ['load', 'error', 'timeout'];
  }
}
