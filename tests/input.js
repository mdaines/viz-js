QUnit.module("input");

QUnit.test("result from first graph in input is returned for multiple invocations", function(assert) {
  var result = Viz("digraph A {} digraph B {}", { format: "xdot" });
  assert.ok(result.match(/digraph A/), "Result should contain \"digraph A\"");
  assert.notOk(result.match(/digraph B/), "Result should not contain \"digraph B\"");

  var result = Viz("digraph B {} digraph A {}", { format: "xdot" });
  assert.ok(result.match(/digraph B/), "Result should contain \"digraph B\"");
  assert.notOk(result.match(/digraph A/), "Result should not contain \"digraph A\"");
});

QUnit.test("syntax error in graph throws exception", function(assert) {
  assert.throws(function() {
    Viz("digraph { \n ->");
  }, /error in line 2 near \'->\'/);
});

QUnit.test("syntax error following graph throws exception", function(assert) {
  assert.throws(function() {
    Viz("digraph { \n } ->");
  }, /error in line 2 near \'->\'/);
});

QUnit.test("syntax error message has correct line numbers for multiple invocations", function(assert) {
  for (var i = 0; i < 2; i++) {
    assert.throws(function() {
      Viz("digraph { \n } ->");
    }, /error in line 2 near \'->\'/);
  }
});
