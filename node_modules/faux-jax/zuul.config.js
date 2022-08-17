var zuulConfig = module.exports = {
  tunnel: {
    type: 'localtunnel'
  },
  ui: 'tape',
  browserify: [{
    transform: 'bulkify'
  }],
  // only used when run with saucelabs
  // not activated when dev or phantom
  concurrency: 2, // ngrok only accepts two tunnels by default
  // if browser does not sends output in 120s since last output:
  // stop testing, something is wrong
  browser_output_timeout: 120 * 1000,
  browser_open_timeout: 60 * 4 * 1000,
  browser_retries: 2
};

if (process.env.CI === 'true') {
  zuulConfig.tunnel = {
    type: 'ngrok',
    bind_tls: true
  };
}

var browsers = require('browzers');

zuulConfig.browsers = process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST !== 'false' ?
  browsers.pullRequest :
  browsers.all;
