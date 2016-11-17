QUnit.module("svg");

QUnit.test("svg output includes the correct labels", function(assert) {
  var result = Viz("digraph { a -> b; }", { format: "svg" });
  var element = document.createElement("div");
  element.innerHTML = result;
  
  assert.equal(element.querySelector("g#node1 text").textContent, "a");
  assert.equal(element.querySelector("g#node2 text").textContent, "b");
});
