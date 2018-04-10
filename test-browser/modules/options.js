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
