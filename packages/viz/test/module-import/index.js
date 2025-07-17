import * as Viz from "@viz-js/viz";

Viz.instance().then(viz => console.log(viz.renderString("digraph { a -> b }")));
