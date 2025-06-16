const { instance, Viz } = require("@viz-js/viz");

instance().then(viz => console.log(viz.renderString("digraph { a -> b }")));

Viz.load().then(viz => console.log(viz.renderString("digraph { a -> b }")));
