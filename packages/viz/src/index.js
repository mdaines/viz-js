import Module from "../lib/module.mjs";
import Viz from "./viz.js";
import { decode } from "../lib/encoded.js";

export { graphvizVersion, formats, engines } from "../lib/metadata.js";

export function instance() {
  return Module({ wasm: decode() }).then(m => new Viz(m));
}
