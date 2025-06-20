import Module from "../lib/backend.js";
import Viz from "./viz.js";

export { graphvizVersion, formats, engines } from "../lib/metadata.js";

export function instance() {
  return Module().then(m => new Viz(m));
}
