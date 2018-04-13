QUnit.module("worker");

QUnit.test("should be able to use a worker to render", function(assert) {
  var viz = new Viz({ worker: '../full.module' });
  
  return viz.renderString("digraph { a -> b; }")
  .then(function(result) {
    assert.ok(result);
  });
});
