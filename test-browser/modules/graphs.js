QUnit.module("graphs");

QUnit.test("rendering sample graphs should not throw errors", function(assert) {
  var graphs = ["./graphs/shapes.dot", "./graphs/subgraphs.dot", "./graphs/edge-labels.dot"];
  
  var results = graphs.map(function(graph) {
    var viz = new Viz();
      
    return fetch(graph)
    .then(function(response) { return response.text(); })
    .then(function(text) { return viz.renderString(text); })
    .then(function(str) { assert.ok(str); });
  });
  
  return Promise.all(results);
});
