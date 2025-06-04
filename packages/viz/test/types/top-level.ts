import { instance, graphvizVersion, formats, engines, Viz, type RenderOptions, type RenderResult, type RenderError } from "@viz-js/viz";

let version: string = graphvizVersion;

let supportedEngines: Array<string> = engines;

let supportedFormats: Array<string> = formats;

instance().then(viz => {
  viz.render("digraph { a -> b }");
});

const viz = new Viz();
const loaded: boolean = viz.isLoaded;

viz.load().then(() => {});
