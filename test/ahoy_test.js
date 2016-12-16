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

  Cookies.set('ahoy_track', true);

  t.end();
})

test('Defines ahoy', (t) => {
  t.plan(1);

  t.notEqual(window.ahoy, undefined, 'Ahoy should be globally available');
});

test('Removes ahoy_track cookie when initializing', (t) => {
  t.plan(2);

  t.notEqual(Cookies.get('ahoy_track'), undefined);

  ahoy.start();

  t.equal(Cookies.get('ahoy_track'), undefined);
});

test('POSTs the visit to the backend', (t) => {
  t.plan(3);

  ahoy.start();

  t.equal(server.requests.length, 1, 'Should have fired request');
  t.equal('test-token-abcdef123456',
          server.requests[0].requestHeaders['X-CSRF-Token'],
          'Should set CSRF header');
  t.equal('/ahoy/visits', server.requests[0].url, 'Should POST to correct URL');
});

after('after', (t) => {
  server.restore();
  Cookies.remove('ahoy_track');
  t.end();
})
