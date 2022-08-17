var test = require('tape');

test('we can override setTimeout', function(t) {
  var writable = require('./');

  window.setTimeout = function() {
    return 'BOUH!';
  };

  t.notEqual(setTimeout(function() {}, 10), 'BOUH!', 'setTimeout() was not overriden');

  writable('setTimeout');

  window.setTimeout = function() {
    return 'WELL!';
  };

  t.equal(setTimeout(function() {}, 20), 'WELL!', 'setTimeout() was overriden');

  writable.restore();

  t.end();
});
