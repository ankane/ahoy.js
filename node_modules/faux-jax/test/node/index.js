var test = require('tape');

test('fauxJax intercepts http requests', function(t) {
  var fauxJax = require('../../');
  var http = require('http');

  fauxJax.install();

  fauxJax.once('request', function(req) {
    t.equal(req.requestURL, 'http://www.google.com/');
    t.ok(req.requestHeaders);
    t.equal(req.requestBody, null);
    t.equal(req.requestMethod, 'GET');
    req.respond(200, {
      XLOL: 'test'
    }, 'Hello! HTTP!');
    fauxJax.restore();
  });

  http.request('http://www.google.com', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      t.equal(res.statusCode, 200);
      t.equal(res.headers.xlol, 'test');
      t.equal(Buffer.concat(chunks).toString(), 'Hello! HTTP!');
      t.end();
    });
  }).end();
});

test('does not leak listeners', function(t) {
  var fauxJax = require('../../');
  var http = require('http');

  fauxJax.install();

  fauxJax.once('request', function(req) {
    t.equal(fauxJax.listeners('restore').length, 1);
    req.respond(200, {}, '.');
  });

  http.request('http://www.google.com', function(res) {
    res.on('data', function() { });
    res.on('end', function() {
      t.equal(fauxJax.listeners('restore').length, 0);
      fauxJax.restore();
      t.end();
    });
  }).end();
});

test('fauxJax intercepts https requests', function(t) {
  var fauxJax = require('../../');
  var https = require('https');

  fauxJax.install();

  fauxJax.once('request', function(req) {
    t.equal(req.requestURL, 'https://www.google.com/');
    t.ok(req.requestHeaders);
    t.equal(req.requestBody, null);
    t.equal(req.requestMethod, 'GET');
    req.respond(200, {
      XLOL: 'test'
    }, 'Hello! HTTP!');
    fauxJax.restore();
  });

  https.request('https://www.google.com', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      t.equal(res.statusCode, 200);
      t.equal(res.headers.xlol, 'test');
      t.equal(Buffer.concat(chunks).toString(), 'Hello! HTTP!');
      t.end();
    });
  }).end();
});

test('fauxJax supports gzip', function(t) {
  var fauxJax = require('../../');
  var https = require('https');

  fauxJax.install({gzip: true});

  fauxJax.once('request', function(req) {
    req.respond(200, {
      XLOL: 'test'
    }, 'Hello! HTTP!');
    fauxJax.restore();
  });

  https.request('https://www.google.com', function(res) {
    var zlib = require('zlib');
    var chunks = [];
    res
    .pipe(zlib.createUnzip())
    .on('data', function(chunk) {
      chunks.push(chunk);
    })
    .on('end', function() {
      t.equal(res.statusCode, 200);
      t.equal(res.headers.xlol, 'test');
      t.equal(Buffer.concat(chunks).toString(), 'Hello! HTTP!');
      t.end();
    });
  }).end();
});
