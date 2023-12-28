import { instance, graphvizVersion, formats, engines, type RenderOptions, type RenderResult, type RenderError, type Viz } from "@viz-js/viz";

let version: string = graphvizVersion;

let supportedEngines: Array<string> = engines;

let supportedFormats: Array<string> = formats;

instance().then(viz => {
  viz.render("digraph { a -> b }");
});
