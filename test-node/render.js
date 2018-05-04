const Viz = require('../viz.js');
const { Module, render } = require('../full.js.opaque');
const assert = require('assert');
const path = require('path');
const Worker = require('tiny-worker');

it('should render a graph using tiny-worker', function() {
  let worker = new Worker(path.resolve(__dirname, '../full.js.opaque'));
  let viz = new Viz({ worker });
  
  return viz.renderString('digraph { a -> b; }')
  .then(function(result) {
    assert.ok(result);
    worker.terminate();
  });
});

it('should render a graph using the Module and render functions exported by the render script file', function() {
  let viz = new Viz({ Module, render });
  
  return viz.renderString('digraph { a -> b; }')
  .then(function(result) {
    assert.ok(result);
  });
});
