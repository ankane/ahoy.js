var test = require('tape');

var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');

test('xhr.respond() sets status', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.respond(200);
  t.equal(xhr.status, 200);
  t.end();
});

test('xhr.respond() sets statusText', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.respond(200);
  t.equal(xhr.statusText, 'OK');
  t.end();
});

test('xhr.respond() calls setResponseHeaders', function(t) {
  var headers = {'how': 'dy'};
  var sinon = require('sinon');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  sinon.spy(xhr, 'setResponseHeaders');
  xhr.respond(200, headers);

  t.ok(xhr.setResponseHeaders.calledOnce);
  t.ok(xhr.setResponseHeaders.calledWithExactly(headers));
  xhr.setResponseHeaders.restore();
  t.end();
});

test('xhr.respond() calls setResponseBody', function(t) {
  var body = 'YAW';
  var sinon = require('sinon');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  sinon.spy(xhr, 'setResponseBody');
  xhr.respond(200, {}, body);

  t.ok(xhr.setResponseBody.calledOnce);
  t.ok(xhr.setResponseBody.calledWithExactly(body));
  xhr.setResponseBody.restore();
  t.end();
});
