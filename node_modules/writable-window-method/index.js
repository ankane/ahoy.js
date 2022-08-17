module.exports = writableWindowMethod;

var forEach = require('lodash-compat/collection/forEach');
var isArray = require('lodash-compat/lang/isArray');
var map = require('lodash-compat/collection/map');

var original = window.originalWritableWindowProps = {};

function writableWindowMethod(propNames) {
  if (!isArray(propNames)) {
    propNames = [propNames];
  }

  var firstScript = map(propNames, function appendToFirstScript(propName) {
    return 'if ("' + propName + '" in window) { window.originalWritableWindowProps["' + propName + '"] = ' + propName + '; }';
  }).join('');

  var secondScript = map(propNames, function appendToSecondScript(propName) {
    return 'if ("' + propName + '" in window) { function ' + propName + '() {}; window["' + propName + '"] = window.originalWritableWindowProps["' + propName + '"]; }';
  }).join('');

  // make propNames overwritable
  forEach([firstScript, secondScript], insertInlineScript);
}

function insertInlineScript(scriptContent) {
  var inlineScript = document.createElement('script');
  inlineScript.type = 'text/javascript';
  inlineScript.text = scriptContent;
  document.getElementsByTagName('head')[0].appendChild(inlineScript);
}

writableWindowMethod.original = original;

writableWindowMethod.restore = function() {
  forEach(original, function resetOriginalMethod(method, propName) {
    window[propName] = original[propName];
  });

  original = writableWindowMethod.original = {};
};
