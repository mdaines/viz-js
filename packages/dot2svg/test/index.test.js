import assert from "node:assert/strict";
import { dot2svg } from "../src/index.js";

describe("dot2svg", function() {
  it("fulfills with a string", async function() {
    const svg = await dot2svg("graph { }");

    assert.notStrictEqual(svg.indexOf("<svg"), -1);
  });

  it("recognizes the engine option", async function() {
    const src = "graph { a -- b }";

    const dotSvg = await dot2svg(src, { engine: "dot" });
    const neatoSvg = await dot2svg(src, { engine: "neato" });

    assert.notStrictEqual(dotSvg, neatoSvg);
  });

  it("rejects for invalid syntax", async function() {
    await assert.rejects(dot2svg("invalid"));
  });

  it("rejects for invalid engine", async function() {
    await assert.rejects(dot2svg("graph { }", { engine: "invalid" }));
  });

  it("rejects for empty input", async function() {
    await assert.rejects(dot2svg(""));
  });

  it("rejects for layout error", async function() {
    await assert.rejects(dot2svg("graph { layout=invalid }"));
  });

  it("fulfills if the first graph is valid", async function() {
    assert.ok(await dot2svg("graph { } invalid"));
  });
});
