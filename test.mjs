import * as Viz from "./src/standalone.mjs";

const viz = await Viz.instance();

console.log(viz.renderString("digraph { a -> b }"));
console.log(viz.renderString("digraph { a -> b }", { format: "svg" }));
console.log(viz.renderString("digraph { a -> b }", { format: "json" }));
console.log(viz.renderString("digraph { a -> b; a [label=<<b>A!</b>>] }", { format: "svg" }));
