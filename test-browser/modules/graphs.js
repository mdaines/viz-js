QUnit.module("graphs");

QUnit.test("rendering sample graphs should not throw errors", function(assert) {
  
  var graphs = ["./graphs/shapes.dot", "./graphs/subgraphs.dot", "./graphs/edge-labels.dot"];
  
  assert.expect(graphs.length);
  
  graphs.forEach(function(url) {
    var done = assert.async();
    
    var request = new XMLHttpRequest();
    request.addEventListener("load", function() {
      assert.ok(Viz(this.responseText));
      done();
    });
    request.open("GET", url);
    request.send();
  });
  
});
