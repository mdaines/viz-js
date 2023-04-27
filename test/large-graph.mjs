import { instance } from "../src/standalone.mjs";
import assert from "node:assert/strict";

const viz = await instance();

let src = "digraph {\n";
for (let i = 0; i < 5000; ++i) {
  src += `node${i}\n`;
}
src += "}\n";

console.log(viz.render(src));
