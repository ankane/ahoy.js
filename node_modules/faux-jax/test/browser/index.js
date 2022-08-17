// we wait for dom ready because __zuul makes ajax requests itself
// otherwise we intercept them too
// we use domready@0.3.0 specifically to be compatible
// with ie6/7/8
var domready = require('domready');

// make globals writable to IE<=8,
// so that we can use sinon.useFakeTimers();
// this should be done by sinon.js but not in npm/commonJS world
// see https://github.com/cjohansen/Sinon.JS/pull/600#issuecomment-76154721
require('writable-window-method')([
  'setTimeout',
  'clearTimeout',
  'setImmediate',
  'clearImmediate',
  'setInterval',
  'clearInterval',
  'Date'
]);

domready(run);

function run() {
  var test = require('tape');
  var support = require('../../lib/support');

  var bulkRequire = require('bulk-require');

  if (support.xdr) {
    bulkRequire(__dirname, ['./XDomainRequest/*.js']);
  }

  if (support.xhr) {
    bulkRequire(__dirname, ['./XMLHttpRequest/*.js']);
  }

  if (support.xhr) {
    test('nothing gets intercepted by default', function(t) {
      t.plan(2);
      var xhr = new XMLHttpRequest();
      xhr.open('GET', location.pathname);
      if (support.xhr.addEventListener) {
        xhr.addEventListener('load', function() {
          t.pass('We used addEventListener');
          t.ok(
            /faux\-jax/.test(xhr.responseText),
            'We got the current location content with ajax'
          );
        });
      } else {
        xhr.onreadystatechange = function() {
          if (xhr.readyState !== 4) {
            return;
          }

          t.pass('We used onreadystatechange=');
          t.ok(
            /faux\-jax/.test(xhr.responseText),
            'We got the current location content with ajax'
          );
        };
      }
      xhr.send();
    });

    test('fauxJax intercepts XMLHttpRequests', function(t) {
      var fauxJax = require('../../');

      fauxJax.install();
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/fo1pf1');
      xhr.send();

      fauxJax.once('request', function(req) {
        req.respond(200, {}, 'WO!');
        t.equal('WO!', req.responseText, 'xhr.respond() call worked, body matches');
        fauxJax.restore();
        t.end();
      });
    });
  }

  if (support.xdr) {
    test('fauxJax intercepts XDomainRequests', function(t) {
      var fauxJax = require('../../');

      fauxJax.install();
      var xdr = new XDomainRequest();
      xdr.open('GET', '/fo1pf1');
      xdr.send();

      fauxJax.once('request', function(req) {
        req.respond(200, {}, 'WOXDR!');
        t.equal('WOXDR!', req.responseText, 'xdr.respond() call worked');
        fauxJax.restore();
        t.end();
      });
    });
  }

  test('Calling `fauxJax.install()` twice throws', function(t) {
    var fauxJax = require('../../');

    fauxJax.once('error', function(err) {
      t.ok(err instanceof Error);
      fauxJax.restore();
      t.end();
    });

    fauxJax.install();
    fauxJax.install();
  });

  test('An unexpected request will trigger an error', function(t) {
    var fauxJax = require('../../');
    fauxJax.install();

    // we expect an error being raised
    fauxJax.once('error', function(err) {
      t.ok(err instanceof Error);
      fauxJax.restore();
      t.end();
    });

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/fo1pf1');
    xhr.send();
  });

  test('Calling restore when not installed will emit an error', function(t) {
    var fauxJax = require('../../');
    fauxJax.once('error', function(err) {
      t.ok(err instanceof Error);
      t.end();
    });
    fauxJax.restore();
  });
}
