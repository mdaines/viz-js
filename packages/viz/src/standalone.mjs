import { VizWrapper } from "./viz.mjs";

export { graphvizVersion, formats, engines } from "../lib/metadata.mjs";

export async function instance() {
  const viz = new VizWrapper();
  await viz.load();
  return viz;
}

const Viz = new VizWrapper();

export { Viz, VizWrapper };
