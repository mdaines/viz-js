QUnit.module("png");

QUnit.test("png-image-element format returns an image element", function(assert) {
  var done = assert.async();
  
  var image = Viz("digraph { a -> b; }", { format: "png-image-element" });

  assert.ok(image instanceof Image, "image should be an Image");
  
  image.onload = function() {
    done();
  }
});

QUnit.test("png-image-element format works correctly with characters outside of basic ASCII", function(assert) {
  var done = assert.async();
  
  var image = Viz("digraph { α -> β; }", { format: "png-image-element" });

  assert.ok(image instanceof Image, "image should be an Image");
  
  image.onload = function() {
    done();
  }
});

QUnit.test("specifying the scale option should change the resulting image's natural size", function(assert) {
  var done = assert.async();
  
  var image = Viz("digraph { size=\"1,1!\"; a -> b; }", { format: "png-image-element", scale: 3 });

  image.onload = function() {
    assert.equal(image.height, 96);
    assert.equal(image.naturalHeight, 288);
    done();
  }
});

QUnit.test("png-image-element format with a worker", function(assert) {
  var done = assert.async();
  
  var worker = new Worker(workerPath());
  
  worker.onmessage = function(e) {
    var image = Viz.svgXmlToPngImageElement(e.data);
    assert.ok(image instanceof Image, "image should be an Image");
    done();
  }
  
  worker.postMessage({ src: "digraph { a -> b; }", options: { format: "svg" } });
});

QUnit.test("asking for plain png format should throw an exception", function(assert) {
  assert.throws(function() {
    Viz("digraph { a -> b; }", { format: "png" });
  }, /renderer for png is unavailable/);
});

QUnit.test("svgXmlToPngImageElement calls callback with image element", function(assert) {
  var done = assert.async();
  
  var xml = Viz("digraph { a -> b; }", { format: "svg" });
  
  var nothing = Viz.svgXmlToPngImageElement(xml, 2, function(err, image) {
    assert.ok(image instanceof Image, "image should be an Image");
    done();
  });
  
  assert.equal(undefined, nothing, "svgXmlToPngImageElement should return undefined if called with a callback");
});

QUnit.test("svgXmlToPngImageElement calls callback with error for bad SVG", function(assert) {
  var done = assert.async();
  
  var nothing = Viz.svgXmlToPngImageElement("not svg", 2, function(err, image) {
    assert.notEqual(err, null);
    done();
  });
});

QUnit.test("svgXmlToPngBase64 calls callback with base64 encoded PNG data", function(assert) {
  var done = assert.async();
  
  var xml = Viz("digraph { a -> b; }", { format: "svg" });
  
  Viz.svgXmlToPngBase64(xml, 2, function(err, data) {
    assert.equal(err, null);
    assert.equal(data.slice(0, 6), "iVBORw");
    done();
  });
});

QUnit.test("svgXmlToPngBase64 calls callback with error for bad SVG", function(assert) {
  var done = assert.async();
  
  Viz.svgXmlToPngBase64("not svg", 2, function(err, data) {
    assert.notEqual(err, null);
    done();
  });
});
