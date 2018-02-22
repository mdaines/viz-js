QUnit.module("input");

QUnit.test("result from first graph in input is returned for multiple invocations", function(assert) {
  var result;
  
  result = Viz("digraph A {} digraph B {}", { format: "xdot" });
  assert.ok(result.match(/digraph A/), "Result should contain \"digraph A\"");
  assert.notOk(result.match(/digraph B/), "Result should not contain \"digraph B\"");

  result = Viz("digraph B {} digraph A {}", { format: "xdot" });
  assert.ok(result.match(/digraph B/), "Result should contain \"digraph B\"");
  assert.notOk(result.match(/digraph A/), "Result should not contain \"digraph A\"");
});

QUnit.test("after throwing an exception on invalid input, do not throw one on valid input", function(assert) {
  assert.throws(function() { Viz("digraph { \n ->"); });
  Viz("digraph { a -> b;}");
});

QUnit.test("after throwing an exception on invalid input with an incomplete quoted string, do not throw one on valid input", function(assert) {
  assert.throws(function() { Viz("digraph {\n a -> b [label=\"erroneous]\n}"); });
  Viz("digraph {\n a -> b [label=\"correcteous\"]\n}");
});

QUnit.test("syntax error in graph throws exception", function(assert) {
  assert.throws(function() {
    Viz("digraph { \n ->");
  }, /error in line 2 near \'->\'/);
});

QUnit.test("syntax error following graph throws exception", function(assert) {
  assert.throws(function() {
    Viz("digraph { \n } ->");
  }, /error in line 1 near \'->\'/);
});

QUnit.test("syntax error message has correct line numbers for multiple invocations", function(assert) {
  for (var i = 0; i < 2; i++) {
    assert.throws(function() {
      Viz("digraph { \n } ->");
    }, /error in line 1 near \'->\'/);
  }
});

QUnit.test("input with characters outside of basic latin should not throw an error", function(assert) {
  var result;
  
  result = Viz("digraph { α -> β; }");
  assert.ok(result.match(/α/), "Result should contain \"α\"");
  assert.ok(result.match(/β/), "Result should contain \"β\"");
  
  result = Viz("digraph { a [label=\"åäö\"]; }");
  assert.ok(result.match(/åäö/), "Result should contain \"åäö\"");
});

