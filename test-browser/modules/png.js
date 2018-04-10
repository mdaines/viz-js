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

QUnit.test("specifying the scale option should change the resulting image's natural size", function(assert) {
  var viz = new Viz();
  
  var done = assert.async();
  
  return viz.renderImageElement("digraph { size=\"1,1!\"; a -> b; }", { scale: 3 })
  .then(function(element) {
    element.onload = function() {
      assert.equal(element.height, 96);
      assert.equal(element.naturalHeight, 288);
      done();
    }
  });
});

QUnit.test("asking for plain png format should throw an exception", function(assert) {
  var viz = new Viz();
  
  return viz.renderString("digraph { a -> b; }", { format: "png" })
  .catch(function(error) {
    assert.ok(error.message.match(/renderer for png is unavailable/));
  });
});
