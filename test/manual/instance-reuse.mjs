import { instance } from "../../src/standalone.mjs";
import { makeGraph } from "./utils.mjs";

const viz = await instance();

let src;

console.log("valid input");

src = makeGraph(100);

for (let i = 0; i < 10000; i++) {
  viz.render(src);

  if (i % 1000 == 0) {
    console.log(process.memoryUsage.rss());
  }
}


console.log("valid input containing multiple graphs");

src = makeGraph(100) + makeGraph(100);

for (let i = 0; i < 10000; i++) {
  viz.render(src);

  if (i % 1000 == 0) {
    console.log(process.memoryUsage.rss());
  }
}


console.log("larger valid input");

src = makeGraph(500);

for (let i = 0; i < 10000; i++) {
  viz.render(src);

  if (i % 1000 == 0) {
    console.log(process.memoryUsage.rss());
  }
}


console.log("invalid input");

src = "graph {";

for (let i = 0; i < 10000; i++) {
  viz.render(src);

  if (i % 1000 == 0) {
    console.log(process.memoryUsage.rss());
  }
}


console.log("invalid layout engine option");

src = "graph { a }";

for (let i = 0; i < 10000; i++) {
  viz.render(src, { engine: "invalid" });

  if (i % 1000 == 0) {
    console.log(process.memoryUsage.rss());
  }
}


console.log("invalid format option");

src = "graph { a }";

for (let i = 0; i < 10000; i++) {
  viz.render(src, { format: "invalid" });

  if (i % 1000 == 0) {
    console.log(process.memoryUsage.rss());
  }
}
