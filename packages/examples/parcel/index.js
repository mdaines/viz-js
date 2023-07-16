import { graphvizVersion } from "@viz-js/viz";

document.getElementById("version").appendChild(document.createTextNode(graphvizVersion));

import("@viz-js/viz")
  .then(module => module.instance())
  .then(viz => {
    document.getElementById("output").appendChild(viz.renderSVGElement("digraph { a -> b }"));
  });
