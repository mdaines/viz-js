import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import * as VizPackage from "../src/standalone.mjs";

describe("Viz", function() {
  let viz;

  beforeEach(async function() {
    viz = await VizPackage.instance();
  });

  describe("renderString", function() {
    it("returns the output for the first graph, even if subsequent graphs have errors", function() {
      const result = viz.renderString("graph a { } graph {");

      assert.strictEqual(result, "graph a {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n");
    });

    it("throws an error if the first graph has a syntax error", function() {
      assert.throws(() => { viz.renderString("graph {"); }, /^Error: syntax error/);
    });

    it("throws an error for layout errors", function() {
      assert.throws(() => { viz.renderString("graph { layout=invalid }"); }, /^Error: Layout type: "invalid" not recognized/);
    });

    it("throws an error if there are no graphs in the input", function() {
      assert.throws(() => { viz.renderString(""); }, /^Error: render failed/);
    });

    it("throws an error with the first render error message", function() {
      assert.throws(() => { viz.renderString("graph { layout=invalid; x=1.2.3=y }"); }, /^Error: Layout type: "invalid" not recognized/);
    });

    it("throws for invalid format option", function() {
      assert.throws(() => { viz.renderString("graph { }", { format: "invalid" }); }, /^Error: Format: "invalid" not recognized/);
    });

    it("throws for invalid engine option", function() {
      assert.throws(() => { viz.renderString("graph { }", { engine: "invalid" }); }, /^Error: Layout type: "invalid" not recognized/);
    });

    it("accepts a non-ASCII character", function() {
      assert.match(viz.renderString("digraph { a [label=図] }"), /label=図/);
    });

    it("a graph with unterminated string followed by another call with a valid graph", function() {
      assert.throws(() => { viz.renderString("graph { a[label=\"blah"); }, /^Error: syntax error/);
      assert.ok(viz.renderString("graph { a }"));
    });
  });

  describe("renderSVGElement", function() {
    it("returns an SVG element", function() {
      try {
        const window = (new JSDOM()).window;
        global.DOMParser = window.DOMParser;

        const svg = viz.renderSVGElement("digraph { a -> b }");
        assert.deepStrictEqual(svg.querySelector(".node title").textContent, "a");
        assert.deepStrictEqual(svg.querySelector(".edge title").textContent, "a->b");
      } finally {
        delete global.DOMParser;
      }
    });

    it("throws an error for syntax errors", function() {
      assert.throws(() => { viz.renderSVGElement(`graph {`); }, /^Error: syntax error/);
    });

    it("throws an error if there are no graphs in the input", function() {
      assert.throws(() => { viz.renderSVGElement(""); }, /^Error: render failed/);
    });
  });

  describe("renderJSON", function() {
    it("returns an object", function() {
      assert.deepStrictEqual(viz.renderJSON("digraph a { }").name, "a");
    });

    it("throws an error for syntax errors", function() {
      assert.throws(() => { viz.renderJSON(`graph {`); }, /^Error: syntax error/);
    });

    it("throws an error if there are no graphs in the input", function() {
      assert.throws(() => { viz.renderJSON(""); }, /^Error: render failed/);
    });
  });
});
