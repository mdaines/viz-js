import { instance, graphvizVersion, formats, engines, type RenderOptions, type RenderResult, type RenderError } from "@viz-js/viz";

// @ts-expect-error
import { Viz } from "@viz-js/viz";

// @ts-expect-error
import { type Viz } from "@viz-js/viz";

// @ts-expect-error
import { type SuccessResult } from "@viz-js/viz";

// @ts-expect-error
import { type FailureResult } from "@viz-js/viz";

let version: string = graphvizVersion;

let supportedEngines: Array<string> = engines;

let supportedFormats: Array<string> = formats;

instance().then(viz => {
  viz.render("digraph { a -> b }");
});
