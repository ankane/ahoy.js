module.exports = getEventTarget;

var EventEmitter = require('events').EventEmitter;
var support = require('./support');

function getEventTarget(opts) {
  var forEach = require('lodash-compat/collection/forEach');

  opts = opts || {};

  function EventTarget(events) {
    var eventTarget = this;

    if (support.xhr.addEventListener && opts.addEventListener !== false) {
      this._eventEmitter = new EventEmitter();
    }

    forEach(events, function setToNull(evName) {
      eventTarget['on' + evName] = null;
    });
  }

  if (support.xhr.addEventListener && opts.addEventListener !== false) {
    EventTarget.prototype.addEventListener = function(type, callback/* , capture*/) {
      this._eventEmitter.addListener(type, callback);
    };

    EventTarget.prototype.removeEventListener = function(type, callback/* , capture*/) {
      this._eventEmitter.removeListener(type, callback);
    };
  }

  EventTarget.prototype.dispatchEvent = function(event) {
    var type;

    // XDomainRequest specific case where there's no
    // event object sent
    if (typeof event === 'string') {
      type = event;
      event = undefined;
    } else {
      type = event.type;
    }

    if (typeof this['on' + type] === 'function') {
      this['on' + type](event);
    }

    if (support.xhr.addEventListener && opts.addEventListener !== false) {
      this._eventEmitter.emit(type, event);
    }

    return event && (event.cancelable === false || event.defaultPrevented === undefined);
  };

  return EventTarget;
}
