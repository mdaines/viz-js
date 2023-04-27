import { instance } from "../src/standalone.mjs";

const viz = await instance();

console.log(viz.render("digraph { a -> b }"));
