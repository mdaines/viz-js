const Viz = require('../viz.js');
const { Module, render } = require('../full.js.opaque');
const assert = require('assert');

it('should render a graph as a string', function() {
  let viz = new Viz({ Module, render });
  
  return viz.renderString('digraph { a -> b; }')
  .then(function(result) {
    assert.ok(result);
  });
});
