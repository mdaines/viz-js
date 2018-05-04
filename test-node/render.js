const Viz = require('../viz.js');
const { Module, render } = require('../full.render.js');
const assert = require('assert');
const path = require('path');
const Worker = require('tiny-worker');

it('should render a graph using tiny-worker', function() {
  let worker = new Worker(path.resolve(__dirname, '../full.render.js'));
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
