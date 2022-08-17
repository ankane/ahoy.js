// exercice left for the reader: why is this file named "constructor_" instead
// of "constructor"?

var test = require('tape');

var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');
var support = require('../../../lib/support');

// https://xhr.spec.whatwg.org/#interface-xmlhttprequest
test('XMLHttpRequest interface', function(t) {
  var xhr = new XMLHttpRequest();

  if (support.xhr.events.abort) {
    t.equal(xhr.onabort, null, 'onabort is null');
  }

  if (support.xhr.events.error) {
    t.equal(xhr.onerror, null, 'onerror is null');
  }

  if (support.xhr.events.onload) {
    t.equal(xhr.ononload, null, 'ononload is null');
  }

  if (support.xhr.events.loadend) {
    t.equal(xhr.onloadend, null, 'onloadend is null');
  }

  if (support.xhr.events.loadstart) {
    t.equal(xhr.onloadstart, null, 'onloadstart is null');
  }

  if (support.xhr.events.progress) {
    t.equal(xhr.onprogress, null, 'onprogress is null');
  }

  if (support.xhr.events.readystatechange) {
    t.equal(xhr.onreadystatechange, null, 'onreadystatechange is null');
  }

  if (support.xhr.events.timeout) {
    t.equal(xhr.ontimeout, null, 'ontimeout is null');
  }

  t.equal(xhr.readyState, 0, 'readyState is 0');

  if (support.xhr.response) {
    t.equal(xhr.response, '', 'response is an empty string');
  }

  t.equal(xhr.responseText, '', 'responseText is an empty string');
  t.equal(xhr.responseType, '', 'responseType is an empty string');

  if (support.xhr.responseURL) {
    t.equal(xhr.responseURL, '', 'responseURL is an empty string');
  }

  t.equal(xhr.responseXML, null, 'responseXML is null');
  t.equal(xhr.status, 0, 'response status is 0');
  t.equal(xhr.statusText, '', 'response statusText is an empty string');

  if (support.xhr.timeout) {
    t.equal(xhr.timeout, 0, 'default timeout is 0');
  }

  if (support.withCredentials) {
    t.equal(xhr.withCredentials, false, 'withCredentials defaults to false');
  }

  t.end();
});
