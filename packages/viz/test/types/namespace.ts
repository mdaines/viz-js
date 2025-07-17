import * as Viz from "@viz-js/viz";

Viz.instance().then(viz => {
  viz.render("digraph { a -> b }");
});
