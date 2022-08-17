var test = require('tape');

var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');
var support = require('../../../lib/support');

if (support.xhr.timeout) {
  test('xhr.timeout is initialized at 0', function(t) {
    var xhr = new XMLHttpRequest();
    t.equal(xhr.timeout, 0, 'timeout initialized at 0');
    t.end();
  });

  test('when xhr.timeout has passed, we get a timeout event', function(t) {
    t.plan(1);

    var sinon = require('sinon');
    var clock = sinon.useFakeTimers();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/');
    xhr.timeout = 500;
    xhr.send();

    xhr.ontimeout = function() {
      clock.restore();
      t.pass('We received a timeout event');
    };

    clock.tick(800);
  });

  test('when xhr.timeout has passed, responding will not do anything', function(t) {
    t.plan(2);

    var sinon = require('sinon');
    var clock = sinon.useFakeTimers();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/');
    xhr.timeout = 500;
    xhr.send();

    xhr.ontimeout = function() {
      clock.restore();
      t.pass('We received a timeout event');
    };

    xhr.onload = function() {
      t.fail('We should not get an onload event');
    };

    clock.tick(800);

    xhr.respond(200, {}, 'OK!');

    t.equal(
      xhr.responseText,
      '',
      'xhr.responseText was not updated'
    );
  });
}
