import { instance } from "@viz-js/viz";

instance().then(viz => {
  viz.render("digraph { a -> b }");

  viz.render("digraph { a -> b }", { format: "svg" });

  viz.render("digraph { a -> b }", { format: "svg", engine: "dot", yInvert: false });

  viz.render("digraph { a -> b }", { nodeAttributes: { shape: "circle" } });

  viz.render({ edges: [{ tail: "a", head: "b" }] });

  // @ts-expect-error
  viz.render("digraph { a -> b }", { format: false });

  // @ts-expect-error
  viz.render("digraph { a -> b }", { engine: 123 });

  // @ts-expect-error
  viz.render("digraph { a -> b }", { yInvert: 1 });

  // @ts-expect-error
  viz.render("digraph { a -> b }", { whatever: 123 });

  let stringResult: string = viz.renderString("digraph { a -> b }");

  let svgElementResult: SVGSVGElement = viz.renderSVGElement("digraph { a -> b }");

  let version: string = viz.graphvizVersion;

  let supportedEngines: Array<string> = viz.engines;

  let supportedFormats: Array<string> = viz.formats;
});
