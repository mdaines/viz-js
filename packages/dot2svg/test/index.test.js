import assert from "node:assert/strict";
import { dot2svg } from "../src/index.js";

describe("dot2svg", function() {
  it("fulfills with a string", async function() {
    const svg = await dot2svg("graph { }");

    assert.notStrictEqual(svg.indexOf("<svg"), -1);
  });

  describe("options", function() {
    it("recognizes the layout option", async function() {
      const src = "graph { a -- b }";

      assert.notStrictEqual(
        await dot2svg(src, { layout: "dot" }),
        await dot2svg(src, { layout: "neato" })
      );
    });

    it("recognizes the graphAttributes option", async function() {
      const src = "graph { }";

      assert.notStrictEqual(
        await dot2svg(src),
        await dot2svg(src, { graphAttributes: { "bgcolor": "blue" } })
      );
    });

    it("recognizes the nodeAttributes option", async function() {
      const src = "graph { a }";

      assert.notStrictEqual(
        await dot2svg(src),
        await dot2svg(src, { nodeAttributes: { "shape": "square" } })
      );
    });

    it("recognizes the edgeAttributes option", async function() {
      const src = "graph { a -- b }";

      assert.notStrictEqual(
        await dot2svg(src),
        await dot2svg(src, { edgeAttributes: { "color": "blue" } })
      );
    });

    it("recognizes the reduce option", async function() {
      const src = "graph { a }";

      assert.notStrictEqual(
        await dot2svg(src, { layout: "neato" }),
        await dot2svg(src, { layout: "neato", reduce: true })
      );
    });
  });

  describe("errors", function() {
    it("rejects for invalid syntax", async function() {
      await assert.rejects(dot2svg("invalid"));
    });

    it("rejects for invalid layout", async function() {
      await assert.rejects(dot2svg("graph { }", { layout: "invalid" }));
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
});
