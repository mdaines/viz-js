QUnit.module("png");

QUnit.test("png-image-element format with a worker", function(assert) {
  var done = assert.async();
  
  var worker = new Worker("./worker.js");
  
  worker.onmessage = function(e) {
    var image = Viz.svgXmlToPngImageElement(e.data);
    assert.ok(image instanceof Image, "image should be an Image");
    done();
  }
  
  worker.onerror = function(e) {
    throw e;
  }
  
  worker.postMessage({ src: "digraph { a -> b; }", options: { format: "svg" } });
});

QUnit.test("asking for plain png format should throw an exception", function(assert) {
  assert.throws(function() {
    Viz("digraph { a -> b; }", { format: "png" });
  }, /renderer for png is unavailable/);
});
