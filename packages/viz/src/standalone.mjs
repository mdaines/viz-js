import { Viz as VizClass } from "./viz.mjs";

export { graphvizVersion, formats, engines } from "../lib/metadata.mjs";

export async function instance() {
  const viz = new VizClass();
  await viz.load();
  return viz;
}

const Viz = new VizClass();

export { Viz };
