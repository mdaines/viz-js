/**
 * @module viz
 */

import Module from "../lib/module.mjs";
import Viz from "./viz.mjs";
import { decode } from "../lib/encoded.mjs";

export {
 /**
  * A string indicating the version of Graphviz used for this build.
  * This records the value of {@link Viz#graphvizVersion} at build time and can be used without creating an instance of the {@link Viz} class.
  * @constant {string}
  */
 graphvizVersion,

 /**
  * An array of strings indicating the supported Graphviz output formats in this build.
  * This records the value of {@link Viz#formats} at build time and can be used without creating an instance of the {@link Viz} class.
  * @constant {string[]}
  */
 formats,

 /**
  * An array of strings indicating the supported Graphviz layout engines in this build.
  * This records the value of {@link Viz#engines} at build time and can be used without creating an instance of the {@link Viz} class.
  * @constant {string[]}
  */
 engines
} from "../lib/metadata.mjs";

/**
 * Returns a promise that resolves to an instance of the {@link Viz} class.
 * This function encapsulates instantiating the Emscripten module.
 * @returns {Promise<Viz>}
 */
export function instance() {
  return Module({ wasm: decode() }).then(m => new Viz(m));
}
