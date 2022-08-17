var bind = require('lodash-compat/function/bind');
var test = require('tape');

var support = require('../../../lib/support');
var XDomainRequest = require('../../../lib/XDomainRequest/');

test('xdr.setResponseBody() throws when no body', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});
  t.throws(bind(xdr.setResponseBody, xdr), Error, 'Body is missing');
  t.end();
});

test('xdr.setResponseBody() throws when request not sent', function(t) {
  t.plan(3);
  var xdr = new XDomainRequest();
  t.throws(bind(xdr.setResponseBody, xdr), Error);
  xdr.open('GET', '/');
  t.throws(bind(xdr.setResponseBody, xdr), Error);
  xdr.send();
  xdr.setResponseHeaders({});
  t.doesNotThrow(bind(xdr.setResponseBody, xdr, ''));
});

test('xdr.setResponseBody() throws when xdr.setResponseHeaders() not called', function(t) {
  t.plan(1);
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send('/');
  t.throws(bind(xdr.setResponseBody, xdr, ''));
});

test('xdr.setResponseBody throws when body is not a String', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});
  t.throws(bind(xdr.setResponseBody, xdr, 30), Error, 'Body is not a string');
  t.end();
});

test('xdr.setResponseBody() calls xdr.onprogress() for every 10 bytes', function(t) {
  t.plan(6);

  var body = (new Array(21)).join();
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});

  var receivedEvents = 0;

  xdr.onprogress = function(e) {
    t.notOk(e, 'no event object received');
    t.pass('received a progress event');
    receivedEvents++;
    t.equal(xdr.responseText.length, receivedEvents * 10, 'content length updated');

    if (receivedEvents === 2) {
      xdr.onprogress = function() {};
    }
  };

  xdr.setResponseBody(body);
});

test('xdr.setResponseBody() calls xdr.onload() when finished', function(t) {
  var includes = require('lodash-compat/collection/includes');
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});

  xdr.onload = function listen(receivedEvent) {
    if (includes(support.xdr.eventObjects, 'load')) {
      var expectedEvent = {
        bubbles: false,
        cancelable: false,
        currentTarget: null,
        eventPhase: 2,
        target: null,
        timestamp: 500,
        type: 'load'
      };

      receivedEvent.timestamp = expectedEvent.timestamp;
      t.ok(receivedEvent, 'received a load event');
      t.equal(receivedEvent.bubbles, expectedEvent.bubbles);
      t.equal(receivedEvent.cancelable, expectedEvent.cancelable);
      t.equal(receivedEvent.currentTarget, expectedEvent.currentTarget);
      t.equal(receivedEvent.eventPhase, expectedEvent.eventPhase);
      t.equal(receivedEvent.target, expectedEvent.target);
      t.equal(receivedEvent.timestamp, expectedEvent.timestamp);
      t.equal(receivedEvent.type, expectedEvent.type);
    } else {
      t.notOk(receivedEvent, 'no load event object received');
    }

    t.end();
  };

  xdr.setResponseBody('DAWG');
});

test('xdr.setResponseBody() sets xdr.responseText', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});

  xdr.setResponseBody('DAWG');
  t.equal(xdr.responseText, 'DAWG');
  t.end();
});

test('xdr.setResponseBody() does not change xdr.contentType by default', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});

  xdr.setResponseBody('DAWG');
  t.equal('', xdr.contentType);
  t.end();
});

test('xdr.setResponseBody() sets xdr.contentType when in headers', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({
    'Content-Type': 'application/dawg; utf-9'
  });

  xdr.setResponseBody('DAWG');
  t.equal('application/dawg', xdr.contentType);
  t.end();
});
