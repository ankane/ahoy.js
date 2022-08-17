var bind = require('lodash-compat/function/bind');
var test = require('tape');

var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');

test('xhr.setResponseHeaders() throws when no headers given', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send('/');
  t.throws(bind(xhr.setResponseHeaders, xhr), Error);
  t.end();
});

test('xhr.setResponseHeaders() throws when state is not open', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(bind(xhr.setResponseHeaders, xhr), Error, 'State is not OPENED');
  t.end();
});

test('xhr.setResponseHeaders() throws when send() flag is unset', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(bind(xhr.setResponseHeaders, xhr), Error, 'State is not OPENED');
  xhr.open('GET', '/');
  t.throws(bind(xhr.setResponseHeaders, xhr), Error, 'Send() flag is unset');
  t.end();
});

test('xhr.setResponseHeaders() sets response headers', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();

  xhr.setResponseHeaders({
    'cache-control': 'no way'
  });

  t.deepEqual(xhr.responseHeaders, {
    'cache-control': 'no way'
  }, 'Response headers matches');

  t.end();
});

test('xhr.setResponseHeaders() sets readyState to HEADERS_RECEIVED (2)', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();

  xhr.setResponseHeaders({});

  t.equal(xhr.readyState, 2, 'readyState is HEADERS_RECEIVED');
  t.end();
});

test('xhr.setResponseHeaders() fires a readystatechange event', function(t) {
  t.plan(7);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();

  var expectedEvent = {
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    target: xhr,
    timestamp: 500,
    type: 'readystatechange'
  };

  xhr.onreadystatechange = function(receivedEvent) {
    receivedEvent.timestamp = expectedEvent.timestamp;
    t.equal(receivedEvent.bubbles, expectedEvent.bubbles);
    t.equal(receivedEvent.cancelable, expectedEvent.cancelable);
    t.equal(receivedEvent.currentTarget, expectedEvent.currentTarget);
    t.equal(receivedEvent.eventPhase, expectedEvent.eventPhase);
    t.equal(receivedEvent.target, expectedEvent.target);
    t.equal(receivedEvent.timestamp, expectedEvent.timestamp);
    t.equal(receivedEvent.type, expectedEvent.type);
  };

  xhr.setResponseHeaders({});
  t.end();
});
