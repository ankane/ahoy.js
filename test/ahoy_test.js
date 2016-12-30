import test from 'tape';
import Cookies from 'js-cookie';
import sinon from 'sinon';

const before = test;
const after = test;
let server;

before('before', (t) => {
  server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.respondWith('GET', '/ahoy/visits', [200, {}, '']);

  t.end();
})

test('Defines ahoy', (t) => {
  t.plan(1);

  t.notEqual(window.ahoy, undefined, 'Ahoy should be globally available');
});

test('Initialization', (t) => {
  t.plan(6);

  ahoy.reset();
  Cookies.set('ahoy_track', true);

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

  ahoy.reset();
  ahoy.start();

  t.equal(server.requests.length, 1, 'Should have fired request');
  t.equal(server.requests[0].requestHeaders['X-CSRF-Token'],
          'test-token-abcdef123456',
          'Should set CSRF header');
  t.equal(server.requests[0].url, '/ahoy/visits', 'Should POST to correct URL');
});

after('after', (t) => {
  server.restore();

  t.end();
})
