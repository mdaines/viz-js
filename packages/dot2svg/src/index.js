import { instance } from "@viz-js/viz";

let viz;

function prepareOptions(options = {}) {
  const { layout, graphAttributes, nodeAttributes, edgeAttributes, images, reduce } = options;

  return {
    graphAttributes,
    nodeAttributes,
    edgeAttributes,
    engine: layout,
    format: "svg",
    images,
    reduce
  };
}

export async function dot2svg(src, options) {
  if (viz === undefined) {
    viz = await instance();
  }

  return viz.renderString(src, prepareOptions(options));
}
