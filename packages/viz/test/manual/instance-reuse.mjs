import { instance } from "../../src/standalone.mjs";
import { makeGraph } from "./utils.mjs";

const basicGraph = makeGraph(100, 10);
const multipleGraphs = `${basicGraph}${basicGraph}`;
const invalidInput = "graph {";

const tests = [
  { label: "valid input", fn: viz => viz.render(basicGraph) },
  { label: "valid input containing multiple graphs", fn: viz => viz.render(multipleGraphs) },
  { label: "invalid input", fn: viz => viz.render(invalidInput) },
  { label: "invalid layout engine option", fn: viz => viz.render(basicGraph, { engine: "invalid" }) },
  { label: "invalid format option", fn: viz => viz.render(basicGraph, { format: "invalid" }) },
  { label: "list layout engines", fn: viz => viz.engines },
  { label: "list formats", fn: viz => viz.formats }
];

for (const { label, fn } of tests) {
  const viz = await instance();

  console.log(label);

  let previous = 0;

  for (let i = 0; i < 10000; i++) {
    fn(viz);

    const current = process.memoryUsage.rss();

    if (i % 1000 == 999) {
      console.log(`count: ${i+1}`, `rss: ${current}`, previous > 0 ? `change: ${current - previous}` : "");
      previous = current;
    }
  }
}
