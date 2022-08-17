require('../auto');

var test = require('tape');
var defineProperties = require('define-properties');
var callBind = require('call-bind');
var hasStrictMode = require('has-strict-mode')();

var isEnumerable = Object.prototype.propertyIsEnumerable;
var functionsHaveNames = require('functions-have-names')();

var runTests = require('./tests');

test('shimmed', function (t) {
	t.equal(Array.prototype.every.length, 1, 'Array#every has a length of 1');
	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(Array.prototype.every.name, 'every', 'Array#every has name "every"');
		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(Array.prototype, 'every'), 'Array#every is not enumerable');
		et.end();
	});

	var supportsStrictMode = (function () { return typeof this === 'undefined'; }());

	t.test('bad array/this value', { skip: !supportsStrictMode }, function (st) {
		st['throws'](function () { return Array.prototype.every.call(undefined, 'a'); }, TypeError, 'undefined is not an object');
		st['throws'](function () { return Array.prototype.every.call(null, 'a'); }, TypeError, 'null is not an object');
		st.end();
	});

	t.test('receiver boxing', function (st) {
		st.plan(hasStrictMode ? 3 : 2);

		var context = 'x';

		Array.prototype.every.call('foo', function () {
			st.equal(typeof this, 'object');
			st.equal(String.prototype.toString.call(this), context);
		}, context);

		st.test('strict mode', { skip: !hasStrictMode }, function (sst) {
			sst.plan(2);

			Array.prototype.every.call('foo', function () {
				'use strict';

				sst.equal(typeof this, 'string');
				sst.equal(this, context);
			}, context);
			sst.end();
		});

		st.end();
	});

	runTests(callBind(Array.prototype.every), t);

	t.end();
});
