import { writeFileSync } from "node:fs";
import { Viz } from "../src/viz.mjs";

const args = process.argv.slice(2);

const viz = new Viz();
await viz.load();

const code = `export const graphvizVersion = ${JSON.stringify(viz.graphvizVersion)};
export const formats = ${JSON.stringify(viz.formats)};
export const engines = ${JSON.stringify(viz.engines)};
`;

writeFileSync(args[0], code);
