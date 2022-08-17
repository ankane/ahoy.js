var test = require('tape');

var XDomainRequest = require('../../../lib/XDomainRequest/');

test('xdr.respond() calls setResponseHeaders', function(t) {
  var headers = {'how': 'dy'};
  var sinon = require('sinon');
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  sinon.spy(xdr, 'setResponseHeaders');
  xdr.respond(200, headers);

  t.ok(xdr.setResponseHeaders.calledOnce);
  t.ok(xdr.setResponseHeaders.calledWithExactly(headers));
  xdr.setResponseHeaders.restore();
  t.end();
});

test('xdr.respond() calls setResponseBody', function(t) {
  var body = 'YAW';
  var sinon = require('sinon');
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  sinon.spy(xdr, 'setResponseBody');
  xdr.respond(200, {}, body);

  t.ok(xdr.setResponseBody.calledOnce);
  t.ok(xdr.setResponseBody.calledWithExactly(body));
  xdr.setResponseBody.restore();
  t.end();
});
