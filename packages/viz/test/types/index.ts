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
  let options: RenderOptions = {};

  options.format = "dot";
  options.engine = "dot";
  options.yInvert = true;
  options.graphAttributes = { rankdir: "LR" };
  options.nodeAttributes = { width: 2 };
  options.edgeAttributes = { color: "green" };

  // @ts-expect-error
  options.format = false;

  // @ts-expect-error
  options.engine = 123;

  // @ts-expect-error
  options.yInvert = 1;

  // @ts-expect-error
  options.whatever = 123;

  let result: RenderResult;

  result = viz.render("digraph { a -> b }");

  result = viz.render("digraph { a -> b }", { format: "svg" });

  result = viz.render("digraph { a -> b }", { format: "svg", engine: "dot", yInvert: false });

  result = viz.render("digraph { a -> b }", { nodeAttributes: { shape: "circle" } });

  result = viz.render({});

  result = viz.render({
    edges: [
      { tail: "a", head: "b" }
    ]
  });
  result = viz.render({
    directed: false,
    strict: false,
    name: "G",
    nodeAttributes: {
      shape: "circle"
    },
    graphAttributes: {
      label: "Test"
    },
    nodes: [
      { name: "a", attributes: { label: "A" } }
    ],
    edges: [
      { tail: "a", head: "b" }
    ],
    subgraphs: [
      {
        name: "cluster1",
        edgeAttributes: {
          color: "blue"
        },
        graphAttributes: {
          color: "green"
        },
        subgraphs: [
          {
            nodes: [
              { name: "b" }
            ]
          }
        ]
      }
    ]
  });

  result = viz.render({
    graphAttributes: {
      width: 2,
      abc: true,
      label: { html: "<b>test</b>" }
    },
    nodes: [
      {
        name: "a",
        attributes: {
          width: 2,
          abc: true,
          label: { html: "<b>test</b>" }
        }
      }
    ]
  });

  result = viz.render({
    graphAttributes: {
      // @ts-expect-error
      blah: null,
      // @ts-expect-error
      label: { stuff: "abc" }
    }
  });

  // @ts-expect-error
  result = viz.render({ a: "b" });

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
