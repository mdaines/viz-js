// Based on https://github.com/samccone/travis-sauce-connect

var assert = require("assert");
var webdriver = require("selenium-webdriver");

describe("Browser tests", function() {
  beforeEach(function() {
    if (process.env.SAUCE_USERNAME != undefined) {
      this.browser = new webdriver.Builder()
      .usingServer("http://"+ process.env.SAUCE_USERNAME+":"+process.env.SAUCE_ACCESS_KEY+"@ondemand.saucelabs.com:80/wd/hub")
      .withCapabilities({
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        browserName: "chrome"
      }).build();
    } else {
      this.browser = new webdriver.Builder()
      .withCapabilities({
        browserName: "chrome"
      }).build();
    }

    return this.browser.get("http://localhost:8000/test-browser/index.html");
  });

  afterEach(function() {
    return this.browser.quit();
  });
  
  it("should not have test failures", function(done) {
    this.browser.executeAsyncScript(function(callback) {
      var log = [];
      QUnit.log(function(details) {
        log.push(details);
      });
      QUnit.done(function(results) {
        callback({ results: results, log: log });
      });
      QUnit.start();
    }).then(function(output) {
      console.log(output.log);
      assert.equal(output.results.failed, 0);
      done();
    });
  });
});
