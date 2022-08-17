var test = require('tape');
var XDomainRequest = require('../../../lib/XDomainRequest/');

// https://msdn.microsoft.com/en-us/library/ie/cc288060(v=vs.85).aspx
test('xdr.abort() cancels the current HTTP request', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({
    'Content-Type': 'application/fun; charset=utf-6'
  });
  xdr.setResponseBody('YAYA!');
  xdr.abort();

  t.equal('', xdr.contentType, 'xdr.contentType was reset to empty string');
  t.equal('', xdr.responseText, 'xdr.responseText was reset to empty string');
  t.end();
});
