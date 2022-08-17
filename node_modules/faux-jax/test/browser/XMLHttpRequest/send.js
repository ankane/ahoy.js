var bind = require('lodash-compat/function/bind');
var forEach = require('lodash-compat/collection/forEach');
var test = require('tape');

var support = require('../../../lib/support');
var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');

test('xhr.send() throws when state is not OPENED', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(bind(xhr.send, xhr), Error, 'State is not OPENED');
  t.end();
});

test('xhr.send() throws when send() flag is set', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.sendFlag = true;
  t.throws(bind(xhr.send, xhr), Error, 'send() flag is true');
  t.end();
});

test('xhr.send() sets default `Content-Type` when none set', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/yaw');
  xhr.send('Hello!');

  t.equal(xhr.requestHeaders['Content-Type'], 'text-plain;charset=UTF-8', 'Default Content-Type set');
  t.end();
});

test('xhr.send() does not sets a default `Content-Type` when no body', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/yaw');
  xhr.send();

  t.equal(xhr.requestHeaders['Content-Type'], undefined, 'No default Content-Type set');
  t.end();
});

test('xhr.send() sets requestBody', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/yaw');
  xhr.send('Hello!');

  t.equal(xhr.requestBody, 'Hello!', 'requestBody set');
  t.end();
});

test('xhr.send() sets requestBody to null when GET or HEAD', function(t) {
  t.plan(2);

  var methods = ['GET', 'HEAD'];
  var body = 'YAW!';

  forEach(methods, function(methodName) {
    var xhr = new XMLHttpRequest();
    xhr.open(methodName, '/HAI');
    xhr.send(body);

    t.equal(xhr.requestBody, null, 'No body set for ' + methodName);
  });
});


if (support.xhr.events.loadstart) {
  test('xhr.send() fires a loadstart event', function(t) {
    t.plan(7);

    var xhr = new XMLHttpRequest();

    var expectedEvent = {
      bubbles: false,
      cancelable: false,
      currentTarget: xhr,
      eventPhase: 0,
      lengthComputable: false,
      loaded: 0,
      target: xhr,
      timestamp: 500,
      total: 0,
      type: 'loadstart'
    };

    xhr.onloadstart = function(receivedEvent) {
      receivedEvent.timestamp = expectedEvent.timestamp;
      t.equal(receivedEvent.bubbles, expectedEvent.bubbles);
      t.equal(receivedEvent.cancelable, expectedEvent.cancelable);
      t.equal(receivedEvent.currentTarget, expectedEvent.currentTarget);
      t.equal(receivedEvent.eventPhase, expectedEvent.eventPhase);
      t.equal(receivedEvent.target, expectedEvent.target);
      t.equal(receivedEvent.timestamp, expectedEvent.timestamp);
      t.equal(receivedEvent.type, expectedEvent.type);
    };

    xhr.open('POST', '/yaw');
    xhr.send('Hello!');
  });
}

test('xhr.send() sets Content-Type in a case insensitive manner', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  // .send() will try to set a `Content-Type` if none, we test that there's
  // no duplicate `content-type`
  xhr.send();
  t.deepEqual(
    xhr.requestHeaders, {
      'Content-type': 'application/json;charset=UTF-8'
    }
  );
  t.end();
});
