QUnit.module("input");

QUnit.test("result from first graph in input is returned for multiple invocations", function(assert) {
  var viz = new Viz();
  
  return viz.renderString("digraph A {} digraph B {}", { format: "xdot" })
  .then(function(result) {
    assert.ok(result.match(/digraph A/), "Result should contain \"digraph A\"");
    assert.notOk(result.match(/digraph B/), "Result should not contain \"digraph B\"");
  })
  .then(function() {
    return viz.renderString("digraph B {} digraph A {}", { format: "xdot" });
  })
  .then(function(result) {
    assert.ok(result.match(/digraph B/), "Result should contain \"digraph B\"");
    assert.notOk(result.match(/digraph A/), "Result should not contain \"digraph A\"");
  });
});

QUnit.test("after throwing an exception on invalid input with an incomplete quoted string, continue to throw exceptions on valid input", function(assert) {
  var viz = new Viz();
  
  assert.expect(2);
  
  return viz.renderString("digraph {\n a -> b [label=\"erroneous]\n}")
  .catch(function(error) {
    assert.ok(error);
  })
  .then(function() {
    return viz.renderString("digraph {\n a -> b [label=\"correcteous\"]\n}");
  })
  .catch(function(error) {
    assert.ok(error);
  })
});

QUnit.test("syntax error in graph throws exception", function(assert) {
  var viz = new Viz();
  
  assert.expect(1);
  
  return viz.renderString("digraph { \n ->")
  .catch(function(error) {
    assert.ok(error.message.match(/error in line 2 near \'->\'/));
  });
});

QUnit.test("syntax error following graph throws exception", function(assert) {
  var viz = new Viz();
  
  assert.expect(1);
  
  return viz.renderString("digraph { \n } ->")
  .catch(function(error) {
    assert.ok(error.message.match(/error in line 1 near \'->\'/));
  });
});

QUnit.test("syntax error message has correct line numbers for multiple invocations", function(assert) {
  var viz = new Viz();
  
  assert.expect(2);
  
  return viz.renderString("digraph { \n } ->")
  .catch(function(error) {
    assert.ok(error.message.match(/error in line 1 near \'->\'/));
  })
  .then(function() {
    return viz.renderString("digraph { \n } ->");
  })
  .catch(function(error) {
    assert.ok(error.message.match(/error in line 1 near \'->\'/));
  });
});

QUnit.test("input with characters outside of basic latin should not throw an error", function(assert) {
  var viz = new Viz();
  
  return viz.renderString("digraph { α -> β; }")
  .then(function(result) {
    assert.ok(result.match(/α/), "Result should contain \"α\"");
    assert.ok(result.match(/β/), "Result should contain \"β\"");
  })
  .then(function() {
    return viz.renderString("digraph { a [label=\"åäö\"]; }");
  })
  .then(function(result) {
    assert.ok(result.match(/åäö/), "Result should contain \"åäö\"");
  });
});
