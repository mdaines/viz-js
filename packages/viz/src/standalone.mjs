import Module from "../lib/module.mjs";
import Viz from "./viz.mjs";
import { decode } from "../lib/encoded.mjs";

export { graphvizVersion, formats, engines } from "../lib/metadata.mjs";

export function instance() {
  return Module({
    instantiateWasm(imports, successCallback) {
      WebAssembly.instantiate(decode(), imports).then(result => {
        successCallback(result.instance);
      });

      return {};
    }
  }).then(m => new Viz(m));
}
