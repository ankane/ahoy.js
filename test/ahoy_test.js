import test from 'tape';
import Cookies from 'js-cookie';

const before = test;
const after = test;

before('before', (t) => {
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

after('after', (t) => {
  Cookies.remove('ahoy_track');
  t.end();
})
