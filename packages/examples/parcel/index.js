import { graphvizVersion } from "@viz-js/viz";

function randomNode() {
  return Math.ceil(Math.random() * 10);
}

function randomGraph() {
  return {
    edges: Array.from({ length: 10 }, () => ({ tail: randomNode(), head: randomNode() }))
  };
}

document.getElementById("version").appendChild(document.createTextNode(graphvizVersion));

import("@viz-js/viz")
  .then(module => module.instance())
  .then(viz => {
    document.getElementById("output").appendChild(viz.renderSVGElement(randomGraph()));
  });
