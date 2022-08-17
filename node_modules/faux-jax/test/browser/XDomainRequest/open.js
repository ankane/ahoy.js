var bind = require('lodash-compat/function/bind');
var forEach = require('lodash-compat/collection/forEach');
var test = require('tape');
var XDomainRequest = require('../../../lib/XDomainRequest/');

test('xdr.open() throws when missing parameters', function(t) {
  t.plan(1);
  var xdr = new XDomainRequest();
  t.throws(bind(xdr.open, xdr), Error);
});

test('xdr.open() throws when missing url', function(t) {
  t.plan(1);
  var xdr = new XDomainRequest('GET');
  t.throws(bind(xdr.open, xdr, 'GET'), Error);
});

test('xdr.open() throws when bad method name', function(t) {
  t.plan(1);
  var xdr = new XDomainRequest();
  t.throws(bind(xdr.open, xdr, 'dsad', '/'), Error);
});

var methods = ['get', 'post', 'GET', 'POST', 'GeT', 'PoST'];
forEach(methods, function testMethod(methodName) {
  test('xdr.open() accepts ' + methodName + ' method', function(t) {
    t.plan(3);
    var xdr = new XDomainRequest();
    t.doesNotThrow(bind(xdr.open, xdr, methodName, '/'));
    t.equal(
      xdr.requestMethod,
      methodName.toUpperCase(),
      'xdr.requestMethod was set to `' + xdr.requestMethod + '` (was ' + methodName + ')');
    t.equal(xdr.requestURL, '/', 'xdr.requestURL was set to `/`');
  });
});
