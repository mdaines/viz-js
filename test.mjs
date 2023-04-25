import * as Viz from "./src/standalone.mjs";

const viz = await Viz.instance();

console.log(viz.renderString("digraph { a -> b }"));
console.log(viz.renderString("digraph { a -> b }", { format: "svg" }));
console.log(viz.renderString("digraph { a -> b }", { format: "json" }));
console.log(viz.renderString("digraph { a -> b; a [label=<<b>A!</b>>] }", { format: "svg" }));
console.log(viz.renderJSON("digraph { a -> b }"));

console.log(viz.renderString("digraph { a -> b }", { engine: "dot" }));
console.log(viz.renderString("digraph { a -> b }", { engine: "neato" }));
console.log(viz.renderString("digraph { a -> b }", { engine: "twopi" }));
console.log(viz.renderString("digraph { a -> b }", { engine: "circo" }));
console.log(viz.renderString("digraph { a -> b }", { engine: "fdp" }));
console.log(viz.renderString("digraph { a -> b }", { engine: "sfdp" }));
console.log(viz.renderString("digraph { a { b { c } } }", { engine: "patchwork" }));
console.log(viz.renderString("digraph { a; b; { c; d } }", { engine: "osage" }));
