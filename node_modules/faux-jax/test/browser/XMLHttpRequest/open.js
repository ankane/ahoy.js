var bind = require('lodash-compat/function/bind');
var forEach = require('lodash-compat/collection/forEach');
var test = require('tape');

var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');

test('xhr.open() throws when method not a string', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(bind(xhr.open, xhr, 421), SyntaxError, 'Bad method type throws SyntaxError');
  t.end();
});

test('xhr.open() throws when method unknown', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(bind(xhr.open, xhr, 'PLURK'), SyntaxError, 'Bad method name throws SyntaxError');
  t.end();
});

test('xhr.open() accepts uppercase methods', function(t) {
  var methods = ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT', 'CONNECT', 'TRACE', 'TRACK'];
  t.plan(methods.length);

  forEach(methods, function(method) {
    var xhr = new XMLHttpRequest();
    t.doesNotThrow(bind(xhr.open, xhr, method), 'Uppercase accepted methods does not throws');
  });
});

test('xhr.open() normalizes lowercase methods', function(t) {
  var methods = ['get', 'head', 'post', 'patch', 'delete', 'options', 'put'];
  t.plan(methods.length * 2);

  forEach(methods, function(method) {
    var xhr = new XMLHttpRequest();
    t.doesNotThrow(bind(xhr.open, xhr, method), 'Lowercased accepted methods does not throws');
    t.equal(xhr.requestMethod, method.toUpperCase(), 'Method name was lowercased');
  });
});

test('xhr.open() throws on no-uppercase forbidden methods (no auto normalization)', function(t) {
  var methods = ['connect', 'trace', 'track'];

  t.plan(methods.length);

  forEach(methods, function(method) {
    var xhr = new XMLHttpRequest();
    t.throws(bind(xhr.open, xhr, method), Error);
  });
});

test('xhr.open() initialize properties', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('poSt', '/lol.gif');

  t.equal(xhr.requestMethod, 'POST');
  t.equal(xhr.async, true);
  t.equal(xhr.requestURL, '/lol.gif');
  t.equal(xhr.username, undefined);
  t.equal(xhr.password, undefined);

  t.end();
});

test('xhr.open() fires a `readystatechange` event', function(t) {
  t.plan(7);

  var xhr = new XMLHttpRequest();

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

  xhr.open('GET', '/google.gif');
});
