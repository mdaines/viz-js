import { instance, Viz } from "@viz-js/viz";

instance().then(viz => console.log(viz.renderString("digraph { a -> b }")));

Viz.load().then(viz => console.log(viz.renderString("digraph { a -> b }")));
