import { instance } from "@viz-js/viz";

const vizPromise = instance();

function prepareOptions(options = {}) {
  const { layout, graphAttributes, nodeAttributes, edgeAttributes, reduce } = options;

  return {
    graphAttributes,
    nodeAttributes,
    edgeAttributes,
    engine: layout,
    format: "svg",
    reduce
  };
}

export async function dot2svg(src, options) {
  return (await vizPromise).renderString(src, prepareOptions(options));
}
