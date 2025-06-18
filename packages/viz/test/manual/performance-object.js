import { instance } from "../../src/index.js";
import { measure, randomGraph, dotStringify } from "./utils.js";

const tests = [
  { nodeCount: 100, randomEdgeCount: 10 },
  { nodeCount: 1000, randomEdgeCount: 50 },
  { nodeCount: 1000, randomEdgeCount: 500 },
  { nodeCount: 1000, randomEdgeCount: 1000 }
];

tests.forEach(test => {
  test.input = randomGraph(test.nodeCount, test.randomEdgeCount);
});

const timeLimit = 5000;

for (const { input, nodeCount, randomEdgeCount } of tests) {
  const viz = await instance();
  const result = measure(() => viz.render(dotStringify(input)), timeLimit);
  console.log(`stringify, ${nodeCount} nodes, ${randomEdgeCount} edges: ${result}`);
}

for (const { input, nodeCount, randomEdgeCount } of tests) {
  const viz = await instance();
  const result = measure(() => viz.render(input), timeLimit);
  console.log(`map, ${nodeCount} nodes, ${randomEdgeCount} edges: ${result}`);
}
