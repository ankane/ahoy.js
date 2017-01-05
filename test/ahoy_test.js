import test from 'tape';
import Cookies from 'js-cookie';
import sinon from 'sinon';

const before = test;
const after = test;
const AHOY_TRACK_TIMEOUT = 1500;
let server;

before('before', (t) => {
  server = sinon.fakeServer.create();
  server.respondImmediately = true;
  server.respondWith('POST', '/ahoy/visits',
    [200, {},'{}']);
  server.respondWith('POST', '/ahoy/events',
    [200, {},'{}']);

  ahoy.reset();
  Cookies.set('ahoy_track', true);

  t.end();
})

test('Defines ahoy', (t) => {
  t.plan(1);

  t.notEqual(window.ahoy, undefined, 'Ahoy should be globally available');
});

test('Initialization', (t) => {
  t.plan(6);

  t.notEqual(Cookies.get('ahoy_track'), undefined, 'Should have ahoy_track cookie');
  t.equal(Cookies.get('ahoy_visit'), undefined, 'Should not have ahoy_visit cookie');
  t.equal(Cookies.get('ahoy_visitor'), undefined, 'Should not have ahoy_visitor cookie');

  ahoy.start();

  t.equal(Cookies.get('ahoy_track'), undefined, 'Should remove ahoy_track cookie');
  t.notEqual(Cookies.get('ahoy_visit'), undefined, 'Should have ahoy_visit cookie');
  t.notEqual(Cookies.get('ahoy_visitor'), undefined, 'Should have ahoy_visitor cookie');
});

test('POSTs the visit to the backend', (t) => {
  t.plan(3);

  t.equal(server.requests.length, 1, 'Should have fired request');

  const request = server.requests[0];
  t.equal(request.requestHeaders['X-CSRF-Token'],
          'test-token-abcdef123456',
          'Should set CSRF header');
  t.equal(request.url, '/ahoy/visits', 'Should POST to correct URL');
});

test('Manual tracking', (t) => {
  t.plan(2);

  ahoy.track('Test Request', { foo: 'bar' });
  setTimeout(function() {
    t.equal(server.requests.length, 2, 'Should have fired request');

    const request = server.requests[1];
    t.equal(request.url, '/ahoy/events', 'Should POST to correct URL');
  }, AHOY_TRACK_TIMEOUT);
});

test('View tracking', (t) => {
  t.plan(3);

  ahoy.trackView();
  setTimeout(function() {
    t.equal(server.requests.length, 3, 'Should have fired request');

    const request = server.requests[2];
    const requestData = JSON.parse(request.requestBody);

    t.equal(request.url, '/ahoy/events', 'Should POST to correct URL');
    t.equal(requestData.events[0].name, '$view', 'Should POST correct event');
  }, AHOY_TRACK_TIMEOUT);
});

test('Click tracking', (t) => {
  t.plan(6);

  ahoy.trackClicks();
  document.getElementById('ahoy-test-link').click();

  setTimeout(function() {
    t.equal(server.requests.length, 4, 'Should have fired request');

    const request = server.requests[3];
    const requestData = JSON.parse(request.requestBody);
    const requestProperties = requestData.events[0].properties;

    t.equal(request.url, '/ahoy/events', 'Should POST to correct URL');
    t.equal(requestData.events[0].name, '$click', 'Should POST correct event');
    t.equal(requestProperties.id, 'ahoy-test-link', 'Correct event ID property');
    t.equal(requestProperties.section, 'Header', 'Correct event section property');
    t.equal(requestProperties.text, 'Home', 'Correct event text property');
  }, AHOY_TRACK_TIMEOUT);
});

after('after', (t) => {
  server.restore();

  t.end();
})
