'use strict';

var callBound = require('call-bind/callBound');
var callBind = require('call-bind');
var GetIntrinsic = require('get-intrinsic');
var $then = callBound('Promise.prototype.then', true);
var $Promise = GetIntrinsic('%Promise%', true);
var $PromiseResolve = GetIntrinsic('%Promise.resolve%', true);
var $resolve = $Promise && $PromiseResolve && callBind($PromiseResolve, $Promise);

var thunkFalse = function () {
	return false;
};
var thunkTrue = function () {
	return true;
};

module.exports = function hasDynamicImport() {
	if (!$then) {
		var p = {
			then: function (resolve) { // eslint-disable-line consistent-return
				if (typeof resolve === 'function') {
					process.nextTick(function () {
						resolve(false);
					});
				} else {
					return hasDynamicImport();
				}
			}
		};
		return p;
	}

	try {
		var importWrapper = require('./import'); // eslint-disable-line global-require

		return $then(importWrapper(), thunkTrue, thunkFalse);
	} catch (e) {
		return $resolve(false);
	}
};
