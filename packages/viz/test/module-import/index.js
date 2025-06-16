import { instance, Viz } from "@viz-js/viz";

if (!Viz.loaded) {
  console.log("Loading...");

  await Viz.load();
}

console.log(Viz.renderString("digraph { a -> b }"));

const viz = await instance();

console.log(viz.renderString("digraph { a -> b }"));
