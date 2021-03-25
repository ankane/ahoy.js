// Getters and Setters for mock cookies
Object.defineProperty(document, "doctype", {
  value: "<!DOCTYPE html>"
});
let setCookie = (v) => v;

Object.defineProperty(window.navigator, 'cookieEnabled', (function (_value) {
  return {
    get: function _get() {
      return _value;
    },
    set: function _set(v) {
    _value = v;
    },
    configurable: true
  };
})(window.navigator.cookieEnabled));

setCookie = (v) => v;

Object.defineProperty(window.document, 'cookie', (function (_value) {
  return {
    get: function _get() {
      return _value;
    },
    set: function _set(v) {
      _value = setCookie(v);
    },
    configurable: true
  };
})(window.navigator.cookieEnabled));
