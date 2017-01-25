// Reports test results to Sauce Labs.

var log = [];
var testName;
 
QUnit.done(function (test_results) {
  var tests = [];
  for(var i = 0, len = log.length; i < len; i++) {
    var details = log[i];
    tests.push({
      name: details.name,
      result: details.result,
      expected: details.expected,
      actual: details.actual,
      source: details.source
    });
  }
  test_results.tests = tests;
 
  window.global_test_results = test_results;
});

QUnit.testStart(function(testDetails){
  QUnit.log(function(details){
    if (!details.result) {
      details.name = testDetails.name;
      log.push(details);
    }
  });
});

function workerPath() {
  return "./worker.js?" + encodeURIComponent(JSON.stringify({ "path": VIZ_PATH, "time": new Date().getTime() }));
}
