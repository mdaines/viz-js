import { instance } from "../../src/standalone.mjs";
import { makeGraph } from "./utils.mjs";

const viz = await instance();

const matrix = [
  { nodeCount: 100, randomEdgeCount: 0, iterations: 1000 },
  { nodeCount: 1000, randomEdgeCount: 0, iterations: 100 },
  { nodeCount: 5000, randomEdgeCount: 0, iterations: 10 },
  { nodeCount: 100, randomEdgeCount: 10, iterations: 1000 },
  { nodeCount: 1000, randomEdgeCount: 100, iterations: 100 },
  { nodeCount: 5000, randomEdgeCount: 500, iterations: 10 }
];

matrix.forEach(({ nodeCount, randomEdgeCount, iterations }) => {
  const label = `${nodeCount} nodes, ${randomEdgeCount} edges, ${iterations} iterations`;
  const src = makeGraph(nodeCount, randomEdgeCount);

  console.time(label);

  for (let i = 0; i < iterations; i++) {
    viz.render(src);
  }

  console.timeEnd(label);
});
