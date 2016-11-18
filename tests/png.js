QUnit.module("png");

QUnit.test("png-image-element format returns an image", function(assert) {
  var done = assert.async();
  
  var image = Viz("digraph { a -> b; }", { format: "png-image-element" });

  assert.ok(image instanceof Image, "image should be an Image");
  
  image.onload = function() {
    done();
  }
  
  image.onerror = function(e) {
    throw e;
  }
});

QUnit.test("specifying the scale option should change resulting image's natural size", function(assert) {
  var done = assert.async();
  
  var image = Viz("digraph { size=\"1,1!\"; a -> b; }", { format: "png-image-element", scale: 3 });

  image.onload = function() {
    assert.equal(image.height, 96);
    assert.equal(image.naturalHeight, 288);
    done();
  }
  
  image.onerror = function(e) {
    throw e;
  }
});

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
