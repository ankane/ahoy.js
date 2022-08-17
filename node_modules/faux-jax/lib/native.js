var support = require('./support');

var native = module.exports = {};

if (support.xhr) {
  native.XMLHttpRequest = global.XMLHttpRequest;
}

if (support.xdr) {
  native.XDomainRequest = global.XDomainRequest;
}
