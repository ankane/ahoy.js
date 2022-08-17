'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimArrayPrototypeEvery() {
	var polyfill = getPolyfill();
	define(
		Array.prototype,
		{ every: polyfill },
		{ every: function () { return Array.prototype.every !== polyfill; } }
	);
	return polyfill;
};
