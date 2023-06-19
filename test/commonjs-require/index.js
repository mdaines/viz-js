const { instance } = require("@viz-js/viz");

instance().then(viz => console.log(viz.renderString("digraph { a -> b }")));
