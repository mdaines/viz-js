import { type RenderOptions } from "@viz-js/viz";

let options: RenderOptions = {};

options.format = "svg";

options.engine = "dot";

options.yInvert = true;

options.reduce = true;

options.graphAttributes = {
  rankdir: "LR",
  width: 2,
  label: { html: "<b>test</b>" },
  test: true
};

options.nodeAttributes = {
  rankdir: "LR",
  width: 2,
  label: { html: "<b>test</b>" },
  test: true
};

options.edgeAttributes = {
  rankdir: "LR",
  width: 2,
  label: { html: "<b>test</b>" },
  test: true
};

// @ts-expect-error
options.format = false;

// @ts-expect-error
options.engine = 123;

// @ts-expect-error
options.yInvert = 1;

// @ts-expect-error
options.whatever = 123;

// @ts-expect-error
options.graphAttributes = { something: { whatever: 123 } };
