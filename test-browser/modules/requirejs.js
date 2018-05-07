QUnit.module("requirejs");

QUnit.test("should be able to load Viz.js using RequireJS", function(assert) {
  return new Promise(function(resolve, reject) {
    requirejs(['../../viz.js', '../../full.render.js'], function(Viz, options) {
      resolve(new Viz(options));
    });
  })
  .then(function(viz) {
    return viz.renderString("digraph { a -> b; }");
  })
  .then(function(result) {
    assert.ok(result);
  });
});
