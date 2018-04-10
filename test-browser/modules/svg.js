QUnit.module("svg");

QUnit.test("svg output includes the correct labels", function(assert) {
  var viz = new Viz();
  
  return viz.renderSVGElement("digraph { a -> b; }")
  .then(function(element) {
    assert.equal(element.querySelector("g#node1 text").textContent, "a");
    assert.equal(element.querySelector("g#node2 text").textContent, "b");
  });
});
