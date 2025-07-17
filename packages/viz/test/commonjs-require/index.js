const Viz = require("@viz-js/viz");

Viz.instance().then(viz => console.log(viz.renderString("digraph { a -> b }")));
