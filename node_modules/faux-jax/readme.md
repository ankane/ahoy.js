# faux-jax [![Version Badge][npm-version-svg]][package-url] [![Build Status][travis-svg]][travis-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

[![Browser tests][browser-test-matrix]][browser-test-url]

Intercept and respond to:
  - [XMLHttpRequest](https://xhr.spec.whatwg.org/)
  - [XDomainRequest](https://msdn.microsoft.com/en-us/library/ie/cc288060(v=vs.85).aspx) in [compatible environments](#how)
  - Node.js [http(s)](https://nodejs.org/api/http.html) module

```sh
npm install faux-jax --save[-dev]
```

# Browser example

```js
var fauxJax = require('faux-jax');

fauxJax.install();

doRequest();
fauxJax.on('request', respond);

// somewhere in your code:
function doRequest() {
  var xhr = new XMLHttpRequest();

  xhr.open('POST', '/dawg');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(
    JSON.stringify({
      YAW: 'dawg'
    })
  );
  xhr.onload = function() {
    console.log(xhr.status); // 200
    console.log(xhr.response); // {zup: 'bro'}
  }
}

// in a test file probably:
function respond(request) {
  request.respond(
    200, { // status
      'Content-Type': 'application/json' // headers
    },
    '{"zup": "bro?"}' //body
  );

  fauxJax.restore();
}
```

# Node.js example

```js
var http = require('http');
var fauxJax = require('faux-jax');

fauxJax.install();

doRequest();
fauxJax.on('request', respond);

function doRequest() {
  http.request('http://www.google.com', function(res) {
    console.log(res.statusCode); // 200

    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      console.log(Buffer.concat(chunks).toString());
    });
  }).end();
}

function respond(request) {
  request.respond(
    200, { // status
      'Content-Type': 'text/plain' // headers
    },
    'Hello Node.js!' //body
  );

  fauxJax.restore();
}
```

# API

## fauxJax.install([opts])

Replace global `XMLHttpRequest` and `XDomainRequest` with mocks.

* `opts.gzip`: boolean. Set to true in nodejs to receive gzipped responses.

## fauxJax.on('request', cb)

fauxJax is an [EventEmitter](https://nodejs.org/api/events.html#events_class_events_eventemitter).

Everytime a new request is made, you will get a `request` event.

You can listen to it with `cb(request)`.

All requests have the native properties/methods from [the spec](https://xhr.spec.whatwg.org/).

We also added a couple of handy properties/methods for you to ease testing.

## fauxJax.waitFor(nbRequests, cb)

Utility to "wait for n requests". Will call `cb(err, requests)`.

### request.requestMethod

### request.requestURL

### request.requestHeaders

Always `{}` with `XDomainRequest`.

### request.requestBody

### request.respond(status[, headers, body])

### request.setResponseHeaders(headers)

### request.setResponseBody(body[, cb])

## fauxJax.restore()

Sets back global `XMLHttpRequest` and `XDomainRequest` to native implementations.

## fauxJax.support

Object containing [various support flags](./lib/support.js) for your tests, used internally by `faux-jax`.

## Errors

Errors will be emitted when:
  - you try to `.install()` when already installed
  - you try to `.restore()` without calling `.install()`
  - **a request was intercepted while no listener set**

# How

tl;dr; We try to be as close as possible to the mocked native environment.

`faux-jax` uses [feature detection](./lib/support.js) to only expose what's relevant for the current environment.

i.e. on Chrome, we do not intercept nor expose `XDomainRequest`.

Also if the browser only implement [some parts](https://dvcs.w3.org/hg/xhr/raw-file/default/xhr-1/Overview.html) of `XMLHttpRequest`, we mimic it.

# Test

```sh
npm test
```

# Develop

```sh
npm run dev
```

Go to <http://localhost:8080/__zuul>.

[Tests](./test/) are written with [tape](https://github.com/substack/tape) and run through [zuul](https://github.com/defunctzombie/zuul).

# Lint

```sh
npm run lint
```

Uses [eslint](http://eslint.org/), see [.eslintrc](./.eslintrc).

# Thanks

Inspiration for this module came from:
- Sinon.js's [Fake XMLHttpRequest](http://sinonjs.org/docs/#server)
- trek's [FakeXMLHttpRequest](https://github.com/trek/FakeXMLHttpRequest)

Many thanks!

Node.js version is using [moll/node-mitm](https://github.com/moll/node-mitm).

[package-url]: https://npmjs.org/package/faux-jax
[npm-version-svg]: https://img.shields.io/npm/v/faux-jax.svg?style=flat-square
[travis-svg]: https://img.shields.io/travis/algolia/faux-jax/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/algolia/faux-jax
[license-image]: http://img.shields.io/npm/l/faux-jax.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/faux-jax.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=faux-jax
[browser-test-matrix]: https://saucelabs.com/browser-matrix/os-algolia-faux-jax.svg
[browser-test-url]: https://saucelabs.com/u/os-algolia-faux-jax
