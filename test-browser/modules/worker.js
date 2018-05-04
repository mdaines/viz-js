QUnit.module("worker");

QUnit.test("should be able to construct a Viz.js instance with a worker URL", function(assert) {
  var viz = new Viz({ workerURL: '../full.js.opaque' });
  
  return viz.renderString("digraph { a -> b; }")
  .then(function(result) {
    assert.ok(result);
  });
});

QUnit.test("should be able to construct a Viz.js instance with a Worker instance", function(assert) {
  var viz = new Viz({ worker: new Worker('../full.js.opaque') });
  
  return viz.renderString("digraph { a -> b; }")
  .then(function(result) {
    assert.ok(result);
  });
});
