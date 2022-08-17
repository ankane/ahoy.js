'use strict';

var IsCallable = require('es-abstract/2021/IsCallable');
var ToObject = require('es-abstract/2021/ToObject');
var ToUint32 = require('es-abstract/2021/ToUint32');
var callBound = require('call-bind/callBound');
var isString = require('is-string');

// Check failure of by-index access of string characters (IE < 9) and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var $split = callBound('String.prototype.split');

module.exports = function every(callbackfn) {
	var O = ToObject(this);
	var self = splitString && isString(O) ? $split(O, '') : O;
	var len = ToUint32(self.length);
	var T;
	if (arguments.length > 1) {
		T = arguments[1];
	}

	// If no callback function or if callback is not a callable function
	if (!IsCallable(callbackfn)) {
		throw new TypeError('Array.prototype.every callback must be a function');
	}

	for (var i = 0; i < len; i++) {
		if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, O) : callbackfn.call(T, self[i], i, O))) {
			return false;
		}
	}
	return true;
};
