QUnit.module("neato");

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
