# writable-window-method <sup>[![Version Badge][npm-version-svg]][package-url]</sup>
[![Build Status][travis-svg]][travis-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

[![Browser tests][browser-test-matrix]][browser-test-url]

Turn any window property to a writable state in IE <= 8.

```sh
npm install writable-window-method --save[-dev]
```

# Example

```js
var writable = require('writable-window-method');

writable([
  'XMLHttpRequest',
  'Date',
  'setTimeout'
]);

function XMLHttpRequest() {
  console.log('Owned');
}

var noNative = new XMLHttpRequest();
// 'Owned'

var xhr = new writable.original.XMLHttpRequest();
// a real XMLHttpRequest instance
```

# API

## writable([propNames, ..])

Pass an array of property names to make them writable. This does not change
the behavior of the original properties, it just make them writable for you.

## writable.original.propName

Access the original `window.propName` you made writable just before.

## writable.restore()

Restore all writable properties to their original versions.

Populated with every `new XMLHttpRequest()` or `new XDomainRequest()`.

All requests have the original properties/methods from [the spec](https://xhr.spec.whatwg.org/).

We also added a couple of handy properties/methods for you to ease testing.

# Development

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

[package-url]: https://npmjs.org/package/writable-window-method
[npm-version-svg]: http://vb.teelaun.ch/algolia/writable-window-method.svg
[travis-svg]: https://img.shields.io/travis/algolia/writable-window-method/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/algolia/writable-window-method
[license-image]: http://img.shields.io/npm/l/writable-window-method.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/writable-window-method.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=writable-window-method
[browser-test-matrix]: https://saucelabs.com/browser-matrix/opensauce-writable.svg
[browser-test-url]: https://saucelabs.com/u/algolia-writable-window-method
