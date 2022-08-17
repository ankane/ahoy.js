var bind = require('lodash-compat/function/bind');
var test = require('tape');

var XMLHttpRequest = require('../../../lib/XMLHttpRequest/');

test('xhr.setRequestHeader() throws when state is not OPENED', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(bind(xhr.setRequestHeader, xhr, 'content-encoding', 'UTF-8'), Error, 'State is not OPENED');
  t.end();
});

test('xhr.setRequestHeader() throws when send() flag is true', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.sendFlag = true;
  t.throws(bind(xhr.setRequestHeader, xhr), Error, 'send() flag is true');
  t.end();
});

test('xhr.setRequestHeader() throws when name is undefined', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  t.throws(bind(xhr.setRequestHeader, xhr), SyntaxError, 'Bad header name');
  t.end();
});

test('xhr.setRequestHeader() throws when value is undefined', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  t.throws(bind(xhr.setRequestHeader, xhr, 'content-encoding'), SyntaxError, 'No given value');
  t.end();
});

test('xhr.setRequestHeader() adds headers', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.setRequestHeader('name', 'val');
  t.deepEqual(xhr.requestHeaders, {
    name: 'val'
  });
  t.end();
});

test('xhr.setRequestHeader() append values on successive calls', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.setRequestHeader('namE', 'val1');
  xhr.setRequestHeader('name', 'val2');
  xhr.setRequestHeader('NaMe', 'val3');

  t.deepEqual(xhr.requestHeaders, {
    namE: 'val1, val2, val3'
  });
  t.end();
});
