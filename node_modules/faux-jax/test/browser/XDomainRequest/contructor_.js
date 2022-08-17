var test = require('tape');
var XDomainRequest = require('../../../lib/XDomainRequest/');

// https://msdn.microsoft.com/en-us/library/ie/cc288060(v=vs.85).aspx
test('XDomainRequest interface', function(t) {
  var xdr = new XDomainRequest();

  // https://msdn.microsoft.com/en-us/library/ie/cc288060%28v=vs.85%29.aspx#events
  t.equal(xdr.onerror, null, 'onerror is null');
  t.equal(xdr.onload, null, 'onload is null');
  t.equal(xdr.onprogress, null, 'onprogress is null');
  t.equal(xdr.ontimeout, null, 'ontimeout is null');

  // https://msdn.microsoft.com/en-us/library/ie/cc288060%28v=vs.85%29.aspx#properties
  t.equal(xdr.contentType, '', 'contentType is empty');
  t.equal(xdr.responseText, '', 'responseText is empty');
  t.equal(xdr.timeout, -1, 'timeout is -1');

  t.equal(typeof xdr.abort, 'function', 'There is an abort method');
  t.equal(typeof xdr.open, 'function', 'There is an open method');
  t.equal(typeof xdr.send, 'function', 'There is a send method');

  // fauxJax's API
  // properties
  t.equal(xdr.requestBody, null, 'requestBody is null');
  t.equal(xdr.requestMethod, null, 'requestMethod is null');
  t.equal(xdr.requestURL, null, 'requestURL is null');

  // methods
  t.equal(typeof xdr.respond, 'function', 'There is a respond method');
  t.equal(typeof xdr.setResponseHeaders, 'function', 'There is a setResponseHeaders method');
  t.equal(typeof xdr.setResponseBody, 'function', 'There is a setResponseBody method');

  t.end();
});
