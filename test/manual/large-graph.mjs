import { instance } from "../../src/standalone.mjs";
import { makeGraph } from "./utils.mjs";

const viz = await instance();

console.log(viz.render(makeGraph(5000)));
