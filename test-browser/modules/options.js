QUnit.module("options");

QUnit.test("should accept yInvert option", function(assert) {
  function parse(output) {
    return output.match(/pos=\"[^\"]+\"/g).slice(0, 2);
  }
  
  var viz = new Viz();
  var regular, regular2;
  var inverted;
  
  return viz.renderString("digraph { a -> b; }", { format: "xdot" })
  .then(function(result) {
    regular = parse(result);
  })
  .then(function() {
    return viz.renderString("digraph { a -> b; }", { format: "xdot", yInvert: true })
  })
  .then(function(result) {
    inverted = parse(result);
  
    assert.ok(regular[0] != regular[1], "Regular positions should not be equal to each other");
    assert.ok(inverted[0] != inverted[1], "Inverted positions should not be equal to each other");
    assert.deepEqual(inverted, [regular[1], regular[0]], "Inverted positions should be the reverse of regular");
  })
  .then(function() {
    return viz.renderString("digraph { a -> b; }", { format: "xdot" })
  })
  .then(function(result) {
    regular2 = parse(result);
    
    assert.deepEqual(regular, regular2, "Subsequent calls not setting yInvert should return the regular positions");
  });
});

QUnit.test("should accept nop option and produce different outputs", function(assert) {
  var viz = new Viz();
  var regular;
  var nop1;
  var nop2;
  var graphSrc = "digraph { a[pos=\"10,20\"]; b[pos=\"12,22\"]; a -> b [pos=\"20,20 20,20 20,20 20,20\"]; }";
  
  return viz.renderString(graphSrc, { engine: "neato", format: "svg" })
  .then(function(result) {
    regular = result;
  })
  .then(function() {
    return viz.renderString(graphSrc, { engine: "neato", format: "svg", nop: 1 })
  })
  .then(function(result) {
    nop1 = result;
  
    assert.ok(nop1 != regular, "Nop = 1 should produce different result than default");
  })
  .then(function() {
    return viz.renderString(graphSrc, { engine: "neato", format: "svg", nop: 2 })
  })
  .then(function(result) {
	nop2 = result;
    
    assert.ok(nop2 != regular, "Nop = 2 should produce different result than default");
    assert.ok(nop2 != nop1, "Nop = 2 should produce different result than Nop = 1");
  });
});
