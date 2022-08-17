var test = require('tape');

var support = require('../../../lib/support');
var XDomainRequest = require('../../../lib/XDomainRequest/');

test('timeout is initialized at -1', function(t) {
  var xdr = new XDomainRequest();
  t.equal(xdr.timeout, -1, 'timeout initialized at -1');
  t.end();
});

test('when timeout has passed, we get a timeout event', function(t) {
  var includes = require('lodash-compat/collection/includes');
  var sinon = require('sinon');
  var clock = sinon.useFakeTimers();
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.timeout = 500;
  xdr.send();

  xdr.ontimeout = function(receivedEvent) {
    clock.restore();

    if (includes(support.xdr.eventObjects, 'timeout')) {
      var expectedEvent = {
        bubbles: false,
        cancelable: false,
        currentTarget: null,
        eventPhase: 2,
        target: null,
        timestamp: 500,
        type: 'timeout'
      };

      receivedEvent.timestamp = expectedEvent.timestamp;
      t.ok(receivedEvent, 'received a timeout event');
      t.equal(receivedEvent.bubbles, expectedEvent.bubbles);
      t.equal(receivedEvent.cancelable, expectedEvent.cancelable);
      t.equal(receivedEvent.currentTarget, expectedEvent.currentTarget);
      t.equal(receivedEvent.eventPhase, expectedEvent.eventPhase);
      t.equal(receivedEvent.target, expectedEvent.target);
      t.equal(receivedEvent.timestamp, expectedEvent.timestamp);
      t.equal(receivedEvent.type, expectedEvent.type);
    } else {
      t.notOk(receivedEvent, 'no timeout event object received');
    }

    t.end();
  };

  clock.tick(800);
});

test('when timeout has passed, we cannot respond anymore', function(t) {
  t.plan(2);

  var sinon = require('sinon');
  var clock = sinon.useFakeTimers();
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.timeout = 500;
  xdr.send();

  xdr.ontimeout = function() {
    clock.restore();
    t.pass('We received a timeout event');
  };

  xdr.onload = function() {
    t.fail('We should not get an onload event');
  };

  clock.tick(800);

  xdr.respond(200, {}, 'OK!');

  t.equal(
    xdr.responseText,
    '',
    'xdr.responseText was not updated'
  );
});
