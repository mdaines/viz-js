const webdriver = require("selenium-webdriver");
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');

// Build a promise to test the given file with the given capabilities.

function build(file, capabilities) {
  let browser;
  
  if (process.env.SAUCE_USERNAME != undefined) {
    browser = new webdriver.Builder()
    .usingServer("http://"+ process.env.SAUCE_USERNAME+":"+process.env.SAUCE_ACCESS_KEY+"@ondemand.saucelabs.com:80/wd/hub")
    .withCapabilities({
      "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_BUILD_NUMBER,
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      ...capabilities
    })
    .build();
  } else {
    browser = new webdriver.Builder()
    .withCapabilities(capabilities)
    .build();
  }
  
  browser.manage().timeouts().setScriptTimeout(60000);

  return browser.get(`http://localhost:8000/test-browser/${file}?noautostart`)
  .then(function() {
    return browser.executeAsyncScript(function(callback) {
      var log = [];
      QUnit.log(function(details) {
        log.push(details);
      });
      QUnit.done(function(details) {
        callback({ details: details, log: log });
      });
      QUnit.start();
    });
  })
  .then(function(output) {
    browser.quit();
    return { file, capabilities, ...output };
  });
}

// Print to the console with colors.

const colors = {
  pass: 32,
  fail: 31
};

function color(code, string) {
  return '\u001b[' + code + 'm' + string + '\u001b[0m';
}

// Parse --files, which may be given multiple times. Files are relative to test-browser/.

let files;

if (Array.isArray(argv.file)) {
  files = argv.file;
} else if (argv.file != undefined) {
  files = [argv.file];
} else {
  files = [];
}

// Parse capabilities, which may be given multiple times as --browser, and as --capabilities, the path of a json file containing an array of capability objects.

let capabilities = [];

if (Array.isArray(argv.browser)) {
  argv.browser.forEach(browserName => {
    capabilities.push({ browserName });
  });
} else if (argv.browser != undefined) {
  capabilities.push({ browserName: argv.browser });
}

if (argv.capabilities) {
  capabilities = capabilities.concat(require(path.resolve(argv.capabilities)));
}

// Assemble the tests.

let tests = files.reduce((a, f) => {
  return a.concat(capabilities.map(c => {
    return build(f, c);
  }))
}, []);

// Run tests and report results.

Promise.all(tests).then(function(outputs) {
  // Set exit code to 1 if there are any failing tests.
  
  if (outputs.some(({ details }) => details.failed > 0)) {
    process.exitCode = 1;
  }
  
  // Report test results.
  
  outputs.forEach(({ file, capabilities, log, details }) => {
    let label = `${capabilities.browserName}, ${file}`;
    let summary = `(${details.passed} passed, ${details.failed} failed, ${details.total} total, ${details.runtime}ms runtime)`;
    
    if (details.failed == 0) {
      console.log(`${color(colors.pass, "✓")} ${label} ${summary}`);
    } else {
      console.log(`${color(colors.fail, "✖")} ${label} ${summary}`);
    }
    
    log.forEach(({ result, module, name, message, actual, expected, source }) => {
      if (result) {
        return;
      }
      
      console.log(`FAILED: ${module}: ${name}`);

      if (message) {
        console.log(message);
      }
      
      if (actual) {
        console.log(`expected: ${expected}, actual: ${actual}`);
      }
      
      if (source) {
        console.log(source);
      }
    });
  });
})
.catch(function(error) {
  console.log(error);
  process.exitCode = 1;
});
