import { instance } from "../../src/standalone.mjs";
import { makeGraph } from "./utils.mjs";

const viz = await instance();

const basicGraph = makeGraph(100, 10);

const matrix = [
  { label: "valid input", src: basicGraph, options: {} },
  { label: "valid input containing multiple graphs", src: `${basicGraph}${basicGraph}`, options: {} },
  { label: "invalid input", src: "graph {", options: {} },
  { label: "invalid layout engine option", src: basicGraph, options: { engine: "invalid" } },
  { label: "invalid format option", src: basicGraph, options: { format: "invalid" } }
];

matrix.forEach(({ label, src, options }) => {
  console.log(label);

  let previous = 0;

  for (let i = 0; i < 10000; i++) {
    viz.render(src, options);

    const current = process.memoryUsage.rss();

    if (i % 1000 == 999) {
      console.log(`count: ${i+1}`, `rss: ${current}`, previous > 0 ? `change: ${current - previous}` : "");
      previous = current;
    }
  }
});
