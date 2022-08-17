var implementation = require('./implementation');

module.exports = function getPolyfill() {
	if (typeof Array.prototype.every === 'function') {
		var hasPrimitiveContextInStrict = [1].every(function () {
			'use strict';

			return typeof this === 'string' && this === 'x';
		}, 'x');
		if (hasPrimitiveContextInStrict) {
			return Array.prototype.every;
		}
	}
	return implementation;
};
