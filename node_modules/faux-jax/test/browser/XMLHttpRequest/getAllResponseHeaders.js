var test = require('tape');

var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');

test('xhr.getAllResponseHeaders() sends empty string when no headers', function(t) {
  var xhr = new XMLHttpRequest();
  t.equal('', xhr.getAllResponseHeaders(), 'we get an empty string');
  t.end();
});

test('xhr.getAllResponseHeaders() sends all response headers when present', function(t) {
  var headers = {
    'how': 'dy',
    'hai': 'oh'
  };

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  xhr.respond(200, headers);
  t.equal(
    xhr.getAllResponseHeaders(),
    'how: dy\r\nhai: oh\r\n',
    'We get all the response headers in a string, formatted accordingly'
  );
  t.end();
});
