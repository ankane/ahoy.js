var bind = require('lodash-compat/function/bind');
var test = require('tape');

var XDomainRequest = require('../../../lib/XDomainRequest/');

test('xdr.setResponseHeaders() throws when request not sent', function(t) {
  var xdr = new XDomainRequest();
  t.throws(bind(xdr.setResponseHeaders, xdr), Error);
  xdr.open('GET', '/');
  t.throws(bind(xdr.setResponseHeaders, xdr), Error);
  xdr.send();
  t.doesNotThrow(bind(xdr.setResponseHeaders, xdr, {}));
  t.end();
});

test('xdr.setResponseHeaders() throws when no headers given', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send('/');
  t.throws(bind(xdr.setResponseHeaders, xdr), Error, 'no headers given');
  t.end();
});

test('xdr.setResponseHeaders() sets response headers', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();

  xdr.setResponseHeaders({
    'cache-control': 'no way'
  });

  t.deepEqual(
    xdr.responseHeaders, {
      'cache-control': 'no way'
    },
    'Response headers matches'
  );

  t.end();
});
