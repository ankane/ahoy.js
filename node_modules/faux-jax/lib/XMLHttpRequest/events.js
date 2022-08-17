var forEach = require('lodash-compat/collection/forEach');
var support = require('../support');

// https://xhr.spec.whatwg.org/#event-handlers
var events = module.exports = [];

forEach(support.xhr.events, function(isAvailable, eventName) {
  if (isAvailable) {
    events.push(eventName);
  }
});
