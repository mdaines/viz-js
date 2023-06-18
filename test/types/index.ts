import { instance } from "@viz-js/viz";

instance().then(viz => {
  let result;

  result = viz.render("digraph { a -> b }");
  result = viz.render("digraph { a -> b }", { format: "svg" });
  result = viz.render("digraph { a -> b }", { format: "svg", engine: "dot", yInvert: false });

  switch (result.status) {
  case "success":
    {
      let output: string = result.output;
      break;
    }

  case "failure":
    {
      // @ts-expect-error
      let output: string = result.output;
      break;
    }

  // @ts-expect-error
  case "invalid":
    break;
  }

  let errorMessages: Array<string> = result.errors.filter(error => error.level == "error").map(error => error.message);

  // @ts-expect-error
  let invalidLevelMessages: Array<string> = result.errors.filter(error => error.level == "invalid").map(error => error.message);

  // @ts-expect-error
  result = viz.render("digraph { a -> b }", { format: false });

  // @ts-expect-error
  result = viz.render("digraph { a -> b }", { engine: 123 });

  // @ts-expect-error
  result = viz.render("digraph { a -> b }", { yInvert: 1 });

  // @ts-expect-error
  result = viz.render("digraph { a -> b }", { whatever: 123 });

  let stringResult: string = viz.renderString("digraph { a -> b }");

  let svgElementResult: SVGSVGElement = viz.renderSVGElement("digraph { a -> b }");

  let version: string = viz.graphvizVersion;

  let supportedEngines: Array<string> = viz.engines;

  let supportedFormats: Array<string> = viz.formats;
});
