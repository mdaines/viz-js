QUnit.module("options");

QUnit.test("should accept yInvert option", function(assert) {
  var regular, regular2;
  var inverted;
  
  function parse(output) {
    return output.match(/pos=\"[^\"]+\"/g).slice(0, 2);
  }
  
  regular = parse(Viz("digraph { a -> b; }", { format: "xdot" }));
  inverted = parse(Viz("digraph { a -> b; }", { format: "xdot", yInvert: true }));
  
  assert.ok(regular[0] != regular[1], "Regular positions should not be equal to each other");
  assert.ok(inverted[0] != inverted[1], "Inverted positions should not be equal to each other");
  assert.deepEqual(inverted, [regular[1], regular[0]], "Inverted positions should be the reverse of regular");
  
  regular2 = parse(Viz("digraph { a -> b; }", { format: "xdot" }));
  
  assert.deepEqual(regular, regular2, "Subsequent calls not setting yInvert should return the regular positions");
});
