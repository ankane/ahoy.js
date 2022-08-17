var forEach = require('lodash-compat/collection/forEach');
var test = require('tape');

var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');
var support = require('../../../lib/support');

if (support.xhr.response) {
  test('xhr.abort() sets response to error when state > UNSENT and send() flag is true', function(t) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.send();

    // simulate response
    xhr.readyState = 2;
    xhr.abort();

    t.ok(xhr.response instanceof Error, 'response is an Error');
    t.equal(xhr.response.message, 'NetworkError', 'Message is NetworkError');

    t.end();
  });
}

test('xhr.abort() sets readystate to DONE when state > UNSENT and send() flag is true', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.send();

  // simulate response
  xhr.readyState = 2;

  xhr.abort();
  t.equal(xhr.readyState, 4, 'readyState is 4 (DONE)');
  t.end();
});

test('xhr.abort() sends a readystatechange event when state > UNSENT and send() flag is true', function(t) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', '/');
  xhr.send();

  // simulate a response
  xhr.readyState = 2;

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
    receivedEvent.timestamp = 500;
    t.equal(receivedEvent.bubbles, expectedEvent.bubbles);
    t.equal(receivedEvent.cancelable, expectedEvent.cancelable);
    t.equal(receivedEvent.currentTarget, expectedEvent.currentTarget);
    t.equal(receivedEvent.eventPhase, expectedEvent.eventPhase);
    t.equal(receivedEvent.target, expectedEvent.target);
    t.equal(receivedEvent.timestamp, expectedEvent.timestamp);
    t.equal(receivedEvent.type, expectedEvent.type);
    t.end();
  };

  xhr.abort();
});

test('xhr.abort() dispatch ProgressEvent events when state > UNSENT and send() flag is true', function(t) {
  t.plan(21);

  var xhr = new XMLHttpRequest();

  var expectedEvents = [{
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    lengthComputable: false,
    loaded: 0,
    target: xhr,
    timestamp: 500,
    total: 0,
    type: 'progress'
  }, {
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    lengthComputable: false,
    loaded: 0,
    target: xhr,
    timestamp: 500,
    total: 0,
    type: 'abort'
  }, {
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    lengthComputable: false,
    loaded: 0,
    target: xhr,
    timestamp: 500,
    total: 0,
    type: 'loadend'
  }];

  forEach(expectedEvents, function checkReceivedEvents(expectedEvent) {
    xhr['on' + expectedEvent.type] = function(receivedEvent) {
      receivedEvent.timestamp = expectedEvent.timestamp;
      t.equal(receivedEvent.bubbles, expectedEvent.bubbles);
      t.equal(receivedEvent.cancelable, expectedEvent.cancelable);
      t.equal(receivedEvent.currentTarget, expectedEvent.currentTarget);
      t.equal(receivedEvent.eventPhase, expectedEvent.eventPhase);
      t.equal(receivedEvent.target, expectedEvent.target);
      t.equal(receivedEvent.timestamp, expectedEvent.timestamp);
      t.equal(receivedEvent.type, expectedEvent.type);
    };
  });

  xhr.open('POST', '/yaw');
  xhr.send('Hello!');

  // simulate response
  xhr.readyState = 2;

  xhr.abort();
});

test('xhr.abort() resets the xhr properties', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.abort();

  t.equal(xhr.responseType, '', 'responseType is an empty string');
  t.equal(xhr.responseText, '', 'responseText is an empty string');
  t.equal(xhr.responseXML, null, 'responseXML is null');
  t.equal(xhr.readyState, 0, 'readyState is 0');

  if (support.xhr.response) {
    t.equal(xhr.response, '', 'response is an empty string');
  }

  if (support.xhr.responseURL) {
    t.equal(xhr.responseURL, '', 'responseURL is an empty string');
  }

  t.equal(xhr.status, 0, 'status back to 0');
  t.equal(xhr.statusText, '', 'statusText is an empty string');

  if (support.xhr.timeout) {
    t.equal(xhr.timeout, 0, 'timeout back to 0');
  }

  t.end();
});
