import { instance, graphvizVersion, formats, engines, Viz, VizWrapper, type RenderOptions, type RenderResult, type RenderError } from "@viz-js/viz";

let version: string = graphvizVersion;

let supportedEngines: Array<string> = engines;

let supportedFormats: Array<string> = formats;

instance().then(viz => {
  viz.render("digraph { a -> b }");
});

Viz.load().then(viz => {
  viz.render("digraph { a -> b }");
  Viz.render("digraph { a -> b }");
});

const viz = new VizWrapper();
const loaded: boolean = viz.isLoaded;

viz.load().then(() => {});
