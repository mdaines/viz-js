import { instance } from "../../src/standalone.mjs";
import { randomGraph, dotStringify } from "./utils.mjs";

const basicObject = randomGraph(100, 10);
const basicString = dotStringify(basicObject);
const multipleGraphs = `${basicString}${basicString}`;
const invalidInput = "graph {";

const tests = [
  { label: "valid input", fn: viz => viz.render(basicString) },
  { label: "object input", fn: viz => viz.render(basicObject) },
  { label: "valid input containing multiple graphs", fn: viz => viz.render(multipleGraphs) },
  { label: "invalid input", fn: viz => viz.render(invalidInput) },
  { label: "invalid layout engine option", fn: viz => viz.render(basicString, { engine: "invalid" }) },
  { label: "invalid format option", fn: viz => viz.render(basicString, { format: "invalid" }) },
  { label: "list layout engines", fn: viz => viz.engines },
  { label: "list formats", fn: viz => viz.formats }
];

for (const { label, fn } of tests) {
  const viz = await instance();

  console.log(label);

  let previous = 0;

  for (let i = 0; i < 10000; i++) {
    const result = fn(viz);

    const current = process.memoryUsage.rss();

    if (i % 1000 == 999) {
      console.log(`output length: ${result.output?.length}, count: ${i+1}`, `rss: ${current}`, previous > 0 ? `change: ${current - previous}` : "");
      previous = current;
    }
  }
}
