import { instance } from "@viz-js/viz";

instance().then(viz => console.log(viz.renderString("digraph { a -> b }")));
