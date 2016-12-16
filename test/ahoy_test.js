var test = require('tape');

test('Defines ahoy', function(t) {
  t.plan(1);

  t.notEqual(window.ahoy, undefined, 'Ahoy should be globally available');
});
