QUnit.module("png");

QUnit.test("renderImageElement returns an image", function(assert) {
  var viz = new Viz();
  
  return viz.renderImageElement("digraph { a -> b; }")
  .then(function(element) {
    assert.ok(element instanceof Image);
  });
});

QUnit.test("renderImageElement works correctly with characters outside of basic ASCII", function(assert) {
  var viz = new Viz();
  
  return viz.renderImageElement("digraph { α -> β; }")
  .then(function(element) {
    assert.ok(element instanceof Image);
  });
});

QUnit.test("asking for plain png format should throw an exception", function(assert) {
  var viz = new Viz();
  
  assert.expect(1);
  
  return viz.renderString("digraph { a -> b; }", { format: "png" })
  .catch(function(error) {
    assert.ok(error.message.match(/renderer for png is unavailable/));
  });
});
