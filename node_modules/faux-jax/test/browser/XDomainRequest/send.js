var bind = require('lodash-compat/function/bind');
var test = require('tape');

var XDomainRequest = require('../../../lib/XDomainRequest/');

test('xdr.send() throws when body is not a string', function(t) {
  var xdr = new XDomainRequest();

  xdr.open('POST', '/');
  t.throws(bind(xdr.send, xdr, 9), Error, 'cannot set a body to non-string');
  t.end();
});

test('xdr.send() does not throw when method is `GET` and body is truthy', function(t) {
  var xdr = new XDomainRequest();

  xdr.open('GET', '/');
  t.doesNotThrow(bind(xdr.send, xdr, 'fsafsaf'), Error, 'sending a body along a GET request is ok');
  t.end();
});

test('xdr.send() works with GET requests', function(t) {
  t.plan(2);
  var xdr = new XDomainRequest();

  xdr.onerror = function() {
    t.fail('should not receive an error event');
  };

  xdr.open('GET', '/');
  xdr.send();
  t.equal(xdr.requestBody, null, 'No requestBody set');
  t.equal(xdr.responseText, '', 'responseText is empty');
});

test('xdr.send() works with POST requests, without a body', function(t) {
  t.plan(2);
  var xdr = new XDomainRequest();

  xdr.onerror = function() {
    t.fail('should not receive an error event');
  };

  xdr.open('POST', '/');
  xdr.send();
  t.equal(xdr.requestBody, null, 'requestBody not set');
  t.equal(xdr.responseText, '', 'responseText is empty');
});

test('xdr.send() works with POST requests, with a body', function(t) {
  t.plan(2);
  var xdr = new XDomainRequest();

  xdr.onerror = function() {
    t.fail('should not receive an error event');
  };

  xdr.open('POST', '/');
  xdr.send('WOO!');
  t.equal(xdr.requestBody, 'WOO!', 'requestBody matches');
  t.equal(xdr.responseText, '', 'responseText is empty');
});
