import { writeFileSync } from "node:fs";
import Module from "../lib/module.mjs";
import Viz from "../src/viz.mjs";
import { decode } from "../lib/encoded.mjs";

const args = process.argv.slice(2);

const viz = new Viz(await Module({ wasm: decode() }));

const code = `export const graphvizVersion = ${JSON.stringify(viz.graphvizVersion)};
export const formats = ${JSON.stringify(viz.formats)};
export const engines = ${JSON.stringify(viz.engines)};
`;

writeFileSync(args[0], code);
