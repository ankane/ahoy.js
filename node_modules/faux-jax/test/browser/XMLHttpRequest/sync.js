var test = require('tape');
var fauxJax = require('../../../browser.js');

test('xhr.respond() works for sync xhr', function(t) {
  fauxJax.install();

  fauxJax.once('request', function(req) {
    req.respond(200, {}, 'WOSYNC!');
  });

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/fo1pf1', false);
  xhr.send();
  t.equal(xhr.responseText, 'WOSYNC!', 'xhr.respond() call worked synchronously');

  fauxJax.restore();
  t.end();
});
