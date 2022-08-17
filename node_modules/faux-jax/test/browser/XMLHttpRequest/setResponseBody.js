var bind = require('lodash-compat/function/bind');
var test = require('tape');

var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');
var support = require('../../../lib/support');

test('xhr.setResponseBody() throws when body is not a String', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  xhr.setResponseHeaders({});
  t.throws(bind(xhr.setResponseBody, xhr, 30), Error, 'Body is not a string');
  t.end();
});

test('xhr.setResponseBody() throws when state is not OPEN', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(bind(xhr.setResponseBody, xhr, 'boom'), Error, 'State is < OPENED');
  t.end();
});

test('xhr.setResponseBody() throws when send() flag is unset', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  t.throws(bind(xhr.setResponseBody, xhr, 'boom'), Error, 'Send() flag is unset');
  t.end();
});

test('xhr.setResponseBody() throws when state is not HEADERS_RECEIVED', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  t.throws(bind(xhr.setResponseBody, xhr, 'boom'), Error, 'State is < HEADERS_RECEIVED');
  t.end();
});

test('xhr.setResponseBody() sends readystatechange event with a LOADING readyState every 10 bytes', function(t) {
  t.plan(18);

  var body = (new Array(21)).join();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  xhr.setResponseHeaders({});

  var receivedEvents = 0;

  var expectedEvents = [{
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    target: xhr,
    timestamp: 500,
    type: 'readystatechange'
  }, {
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    target: xhr,
    timestamp: 500,
    type: 'readystatechange'
  }];

  xhr.onreadystatechange = function listen(receivedEvent) {
    var expectedEvent = expectedEvents[receivedEvents];
    receivedEvent.timestamp = expectedEvent.timestamp;
    t.equal(receivedEvent.bubbles, expectedEvent.bubbles);
    t.equal(receivedEvent.cancelable, expectedEvent.cancelable);
    t.equal(receivedEvent.currentTarget, expectedEvent.currentTarget);
    t.equal(receivedEvent.eventPhase, expectedEvent.eventPhase);
    t.equal(receivedEvent.target, expectedEvent.target);
    t.equal(receivedEvent.timestamp, expectedEvent.timestamp);
    t.equal(receivedEvent.type, expectedEvent.type);
    t.equal(receivedEvent.target.readyState, 3, 'readyState is LOADING');
    receivedEvents++;
    t.equal(xhr.responseText.length, receivedEvents * 10, 'content length updated');
    if (receivedEvents === 2) {
      xhr.onreadystatechange = function() {};
    }
  };

  xhr.setResponseBody(body);
});

test('xhr.setResponseBody() sends readystatechange event with a DONE readyState when finished', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  xhr.setResponseHeaders({});

  var receivedEvents = [];

  xhr.onreadystatechange = function listen(receivedEvent) {
    receivedEvents.push(receivedEvent);
  };

  xhr.setResponseBody('DAWG');

  var lastEvent = receivedEvents.pop();
  t.equal(lastEvent.target.readyState, 4, 'readyState is DONE');
  t.end();
});

test('xhr.setResponseBody() sends a load event when finished', function(t) {
  t.plan(1);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  xhr.setResponseHeaders({});

  xhr.onload = function listen() {
    if (support.xhr.events.load) {
      t.pass('received a load event');
    } else {
      t.fail('should not receive a load event');
    }
  };

  xhr.setResponseBody('DAWG');

  if (!support.xhr.events.load) {
    t.pass('load event not supported');
  }
});

test('xhr.setResponseBody() sets responseText', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  xhr.setResponseHeaders({});
  xhr.setResponseBody('DAWG');

  t.equal(xhr.responseText, 'DAWG', 'responseText matches');
  t.end();
});

if (support.xhr.responseURL) {
  test('xhr.setResponseBody() sets responseURL when relative', function(t) {
    var urlResolve = require('url').resolve;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'ah/ahahahah#ROFL');
    xhr.send();
    xhr.setResponseHeaders({});
    xhr.setResponseBody('DAWG');

    t.equal(xhr.responseURL, urlResolve(location.href, 'ah/ahahahah'), 'responseURL matches');
    t.end();
  });

  test('xhr.setResponseBody() sets responseURL when absolute', function(t) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://www.google.com/dawg#WIIIIII');
    xhr.send();
    xhr.setResponseHeaders({});
    xhr.setResponseBody('DAWG');

    t.equal(xhr.responseURL, 'http://www.google.com/dawg', 'responseURL matches');
    t.end();
  });
}

if (support.xhr.response) {
  test('xhr.setResponseBody() sets response', function(t) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/');
    xhr.send();
    xhr.setResponseHeaders({});
    xhr.setResponseBody('DAWG');

    t.equal(xhr.response, 'DAWG', 'response matches');
    t.end();
  });
}

if (support.xhr.response) {
  test('xhr.setResponseBody() understand responseType=json', function(t) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/');
    xhr.responseType = 'json';
    xhr.send();
    xhr.setResponseHeaders({});
    xhr.setResponseBody('{"yaw": "dawg"}');

    t.deepEqual(xhr.response, {
      yaw: 'dawg'
    }, 'response matches and is a JSON object');
    t.end();
  });
}
