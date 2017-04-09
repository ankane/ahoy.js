import test from 'tape';
import Cookies from 'js-cookie';
import fauxJax from 'faux-jax';

const before = test;

before('before', (t) => {
  fauxJax.install();
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

  fauxJax.once('request', function(request) {
    t.equal(request.requestMethod, 'POST', 'Should use POST method');
    t.equal(request.requestURL, '/ahoy/visits', 'Should POST to correct URL');
    t.equal(request.requestHeaders['X-CSRF-Token'],
            'test-token-abcdef123456',
            'Should set CSRF header');

    request.respond(200, { 'Content-Type': 'application/json' }, '{}');
    fauxJax.restore();
  });
});

test('Manual tracking', (t) => {
  t.plan(5);

  fauxJax.install();
  fauxJax.once('request', function(request) {
    const event = JSON.parse(request.requestBody).events[0];

    t.equal(request.requestMethod, 'POST', 'Should use POST method');
    t.equal(request.requestURL, '/ahoy/events', 'Should POST to correct URL');
    t.equal(request.requestHeaders['X-CSRF-Token'],
            'test-token-abcdef123456',
            'Should set CSRF header');
    t.equal(event.name, 'Test Request', 'Should set event name property');
    t.deepEqual(event.properties, { foo: 'bar' }, 'Should set event properties property');

    request.respond(200, {}, '{}');
    fauxJax.restore();
  });

  ahoy.track('Test Request', { foo: 'bar' });
});

test('View tracking', (t) => {
  t.plan(3);

  fauxJax.install();
  fauxJax.once('request', function(request) {
    const event = JSON.parse(request.requestBody).events[0];
    console.log(event);

    t.equal(request.requestMethod, 'POST', 'Should use POST method');
    t.equal(request.requestURL, '/ahoy/events', 'Should POST to correct URL');
    t.equal(event.name, '$view', 'Should set event name property');

    request.respond(200, {}, '{}');
    fauxJax.restore();
  });

  ahoy.trackView();
});

test('Click tracking', (t) => {
  t.plan(6);

  fauxJax.install();
  fauxJax.once('request', function(request) {
    const event = JSON.parse(request.requestBody).events[0];
    const properties = event.properties

    t.equal(request.requestMethod, 'POST', 'Should use POST method');
    t.equal(request.requestURL, '/ahoy/events', 'Should POST to correct URL');
    t.equal(event.name, '$click', 'Should set event name property');
    t.equal(properties.id, 'ahoy-test-link', 'Should set event id property');
    t.equal(properties.section, 'Header', 'Should set event section property');
    t.equal(properties.text, 'Home', 'Should set event text property');

    request.respond(200, {}, '{}');
    fauxJax.restore();
  });

  ahoy.trackClicks();
  document.getElementById('ahoy-test-link').click();
});
