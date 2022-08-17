var hasStrictMode = require('has-strict-mode')();

var global = require('globalthis')();
var trueThunk = function () { return true; };
var falseThunk = function () { return false; };

var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false.
var undefinedIfNoSparseBug = canDistinguishSparseFromUndefined ? undefined : { valueOf: function () { return 0; } };

var createArrayLikeFromArray = function createArrayLikeFromArray(arr) {
	var o = {};
	for (var i = 0; i < arr.length; i += 1) {
		if (i in arr) {
			o[i] = arr[i];
		}
	}
	o.length = arr.length;
	return o;
};

var getTestArr = function () {
	var arr = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, false, 0];
	delete arr[1];
	return arr;
};

module.exports = function (every, t) {
	t.test('passes the correct values to the callback', function (st) {
		st.plan(5);

		var expectedValue = {};
		var arr = [expectedValue];
		var context = {};
		every(arr, function (value, key, list) {
			st.equal(arguments.length, 3);
			st.equal(value, expectedValue, 'first argument is the value');
			st.equal(key, 0, 'second argument is the index');
			st.equal(list, arr, 'third argument is the array being iterated');
			st.equal(this, context, 'receiver is the expected value');
		}, context);

		st.end();
	});

	t.test('does not visit elements added to the array after it has begun', function (st) {
		st.plan(2);

		var arr = [1, 2, 3];
		var i = 0;
		every(arr, function (a) {
			i += 1;
			arr.push(a + 3);
			return i <= 3;
		});
		st.deepEqual(arr, [1, 2, 3, 4, 5, 6], 'array has received 3 new elements');
		st.equal(i, 3, 'every callback only called thrice');

		st.end();
	});

	t.test('does not visit elements deleted from the array after it has begun', function (st) {
		var arr = [1, 2, 3];
		var actual = [];
		every(arr, function (x, i) {
			actual.push([i, x]);
			delete arr[1];
			return true;
		});
		st.deepEqual(actual, [[0, 1], [2, 3]]);

		st.end();
	});

	t.test('sets the right context when given none', function (st) {
		var context;
		every([1], function () { context = this; });
		st.equal(context, global, 'receiver is global object in sloppy mode');

		st.test('strict mode', { skip: !hasStrictMode }, function (sst) {
			every([1], function () {
				'use strict';

				context = this;
			});
			sst.equal(context, undefined, 'receiver is undefined in strict mode');
			sst.end();
		});

		st.end();
	});

	t.test('empty array', function (st) {
		st.equal(every([], trueThunk), true, 'true thunk callback yields true');
		st.equal(every([], falseThunk), true, 'false thunk callback yields true');

		st.end();
	});

	t.equal(every([1, 2, 3], trueThunk), true, 'returns true if every callback does');
	t.equal(every([1, 2, 3], falseThunk), false, 'returns false if any callback does');

	t.test('stopping after N elements', function (st) {
		st.test('no context', function (sst) {
			var actual = {};
			var count = 0;
			every(getTestArr(), function (obj, index) {
				actual[index] = obj;
				count += 1;
				return count !== 3;
			});
			sst.deepEqual(actual, { 0: 2, 2: undefinedIfNoSparseBug, 3: true });
			sst.end();
		});

		st.test('with context', function (sst) {
			var actual = {};
			var context = { actual: actual };
			var count = 0;
			every(getTestArr(), function (obj, index) {
				this.actual[index] = obj;
				count += 1;
				return count !== 3;
			}, context);
			sst.deepEqual(actual, { 0: 2, 2: undefinedIfNoSparseBug, 3: true });
			sst.end();
		});

		st.test('arraylike, no context', function (sst) {
			var actual = {};
			var count = 0;
			every(createArrayLikeFromArray(getTestArr()), function (obj, index) {
				actual[index] = obj;
				count += 1;
				return count !== 3;
			});
			sst.deepEqual(actual, { 0: 2, 2: undefinedIfNoSparseBug, 3: true });
			sst.end();
		});

		st.test('arraylike, context', function (sst) {
			var actual = {};
			var count = 0;
			var context = { actual: actual };
			every(createArrayLikeFromArray(getTestArr()), function (obj, index) {
				this.actual[index] = obj;
				count += 1;
				return count !== 3;
			}, context);
			sst.deepEqual(actual, { 0: 2, 2: undefinedIfNoSparseBug, 3: true });
			sst.end();
		});

		st.end();
	});

	t.test('list arg boxing', function (st) {
		st.plan(3);

		every('foo', function (item, index, list) {
			st.equal(item, 'f', 'first letter matches');
			st.equal(typeof list, 'object', 'primitive list arg is boxed');
			st.equal(Object.prototype.toString.call(list), '[object String]', 'boxed list arg is a String');
			return false;
		});

		st.end();
	});
};
