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

it('should throw descriptive error when not enough memory allocated', function() {
  let worker = new Worker(path.resolve(__dirname, '../full.render.js'));
  let viz = new Viz({ worker });
  let dot = 'digraph {';
  for (let i = 0; i < 50000; ++i) {
    dot += `node${i} -> node${i + 1};`;
  }
  dot += '}';

  return viz.renderString(dot).then(
    () => {
     worker.terminate();
     assert.fail('should throw');
    },
    error => {
      worker.terminate();
      assert(
        /Cannot enlarge memory arrays/.test(error.message),
        'should return descriptive error',
      );
    },
  );
});
