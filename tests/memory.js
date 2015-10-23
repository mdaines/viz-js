QUnit.module("memory");

QUnit.test("repeated invocations should not throw an error", function(assert) {
  var done = assert.async();
  
  var expected = 5000;
  var actual = 0;
  
  var worker = new Worker("./worker.js");
  
  worker.onmessage = function(e) {
    actual += 1;
    if (actual == expected) {
      assert.ok(true);
      done();
    }
  }
  
  worker.onerror = function(e) {
    throw e;
  }
  
  for (var i = 0; i < expected; i++) {
    worker.postMessage({ src: "digraph { a -> b; }" });
  }
});
