QUnit.module("images");

QUnit.test("we can reference images by name if we specify their dimensions using the \"images\" option", function(assert) {
  var result = Viz("digraph { a[image=\"test.png\"]; }", { images: [ { path: "test.png", width: 400, height: 300 } ] });

  var element = document.createElement("div");
  element.innerHTML = result;
  
  assert.equal(element.querySelector("image").getAttributeNS("http://www.w3.org/1999/xlink", "href"), "test.png");
  assert.equal(element.querySelector("image").getAttribute("width"), "400px");
  assert.equal(element.querySelector("image").getAttribute("height"), "300px");
});

QUnit.test("we can reference images with a protocol and hostname", function(assert) {
  var result = Viz("digraph { a[id=\"a\",image=\"http://example.com/xyz/test.png\"]; b[id=\"b\",image=\"http://example.com/xyz/test2.png\"]; }", { images: [
    { path: "http://example.com/xyz/test.png", width: 400, height: 300 },
    { path: "http://example.com/xyz/test2.png", width: 300, height: 200 }
  ] });

  var element = document.createElement("div");
  element.innerHTML = result;
  
  assert.equal(element.querySelector("#a image").getAttributeNS("http://www.w3.org/1999/xlink", "href"), "http://example.com/xyz/test.png");
  assert.equal(element.querySelector("#a image").getAttribute("width"), "400px");
  assert.equal(element.querySelector("#a image").getAttribute("height"), "300px");
  
  assert.equal(element.querySelector("#b image").getAttributeNS("http://www.w3.org/1999/xlink", "href"), "http://example.com/xyz/test2.png");
  assert.equal(element.querySelector("#b image").getAttribute("width"), "300px");
  assert.equal(element.querySelector("#b image").getAttribute("height"), "200px");
});
