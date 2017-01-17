QUnit.module("memory");

QUnit.test("repeated invocations using setTimeout should not throw an error", function(assert) {
  var done = assert.async();
  
  var expected = 1000;
  var actual = 0;
  
  function f() {
    Viz("digraph { a -> b; }");
    
    actual += 1;
    
    if (actual % 100 == 0) {
      console.log(actual);
    }
    
    if (actual == expected) {
      assert.ok(true);
      done();
      return;
    }
    
    setTimeout(f, 0);
  }
  
  f();
});

QUnit.test("repeated invocations in a worker should not throw an error", function(assert) {
  var done = assert.async();
  
  var expected = 1000;
  var actual = 0;
  
  var worker = new Worker(workerPath());
  
  worker.onmessage = function(e) {
    actual += 1;

    if (actual % 100 == 0) {
      console.log(actual);
    }
    
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
