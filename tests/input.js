QUnit.module("input");

QUnit.test("recovers from an error", function(assert) {
  var successRender = function() {
    return Viz('digraph G { A -> "B" }', { format: "xdot" });
  };
  var failureRender = function() {
    return Viz('digraph G { A -> "B }', { format: "xdot" });
  };

  var attempt1 = successRender();
  assert.ok(attempt1.match(/digraph G/), "1: valid data succeeds");

  assert.throws(failureRender, /error/, "2: invalid data fails");

  var attempt3 = successRender();
  assert.ok(attempt3.match(/digraph G/), "3: valid data succeeds again");
});

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
