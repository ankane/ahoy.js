// make XMLHttpRequest and XDomainRequest writable on IE6/7/8
// by using ONE BIG HACK™
//
// Original idea by Sinonjs: http://sinonjs.org/releases/sinon-ie-1.12.2.js
// but it required another file to load (another <script> tag)
//
// Then found that you could create an inline script dynamically
// thx to https://github.com/benjamn/populist/commit/50e744c66df17f78eacf41e93d7749ea1b1f4125
// and http://stackoverflow.com/questions/12201485/create-script-tag-in-ie8/12201713#12201713

module.exports = makeNativeImplementationsWritable;

var done;

function makeNativeImplementationsWritable() {
  if (done) {
    return;
  }

  var writable = require('writable-window-method');

  writable(['XMLHttpRequest', 'XDomainRequest']);

  done = true;
}
