import { instance } from "../src/standalone.mjs";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

describe("standalone", function() {
  let viz;

  beforeEach(async function() {
    viz = await instance();
  });

  describe("render", function() {
    it("renders empty input", function() {
      const result = viz.render("");

      assert.deepStrictEqual(result, []);
    });

    it("renders valid input with a single graph", function() {
      const result = viz.render("graph a { }");

      assert.deepStrictEqual(result, [
        {
          status: "success",
          output: "graph a {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n",
          errors: []
        }
      ]);
    });

    it("renders valid input with multiple graphs", function() {
      const result = viz.render("graph a { } graph b { }");

      assert.deepStrictEqual(result, [
        {
          status: "success",
          output: "graph a {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n",
          errors: []
        },
        {
          status: "success",
          output: "graph b {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n",
          errors: []
        }
      ]);
    });

    it("returns error messages for invalid input", function() {
      const result = viz.render("invalid");

      assert.deepStrictEqual(result, [
        {
          status: "failure",
          errors: ["Error", ": ", "syntax error in line 1 near 'invalid'\n"]
        }
      ]);
    });

    it("renders valid input and returns error messages for invalid input", function() {
      const result = viz.render("graph a { } graph {");

      assert.deepStrictEqual(result, [
        {
          status: "success",
          output: "graph a {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n",
          errors: []
        },
        {
          status: "failure",
          errors: ["Error", ": ", "syntax error in line 1\n"]
        }
      ]);
    });

    it("returns error messages for layout errors and renders remaining graphs without layout errors", function() {
      const result = viz.render("graph a { layout=invalid } graph b { layout=dot }");

      assert.deepStrictEqual(result, [
        {
          status: "failure",
          errors: ["Error", ": ", "Layout type: \"invalid\" not recognized. Use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi\n"]
        },
        {
          status: "success",
          output: "graph b {\n\tgraph [bb=\"0,0,0,0\",\n\t\tlayout=dot\n\t];\n\tnode [label=\"\\N\"];\n}\n",
          errors: []
        }
      ]);
    });

    it("renders graphs with syntax warnings", function() {
      const result = viz.render("graph a { x=1.2.3=y } graph b { }");

      assert.deepStrictEqual(result, [
        {
          status: "success",
          output: "graph a {\n\tgraph [.3=y,\n\t\tbb=\"0,0,0,0\",\n\t\tx=1.2\n\t];\n\tnode [label=\"\\N\"];\n}\n",
          errors: ["Warning", ": ", "syntax ambiguity - badly delimited number '1.2.' in line 1 of input splits into two tokens\n"]
        },
        {
          status: "success",
          output: "graph b {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n",
          errors: []
        }
      ]);
    });

    it("returns error messages for invalid engine option", function() {
      const result = viz.render("graph a { } graph b { }", { engine: "invalid" });

      assert.deepStrictEqual(result, [
        {
          status: "failure",
          errors: ["Error", ": ", "Layout type: \"invalid\" not recognized. Use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi\n"]
        },
        {
          status: "failure",
          errors: ["Error", ": ", "Layout type: \"invalid\" not recognized. Use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi\n"]
        }
      ]);
    });

    it("returns error messages for invalid format option", function() {
      const result = viz.render("graph a { } graph b { }", { format: "invalid" });

      assert.deepStrictEqual(result, [
        {
          status: "failure",
          errors: ["Error", ": ", "Format: \"invalid\" not recognized. Use one of: canon cmap cmapx cmapx_np dot dot_json eps fig gv imap imap_np ismap json json0 mp pic plain plain-ext pov ps ps2 svg tk xdot xdot1.2 xdot1.4 xdot_json\n"]
        },
        {
          status: "failure",
          errors: ["Error", ": ", "Format: \"invalid\" not recognized. Use one of: canon cmap cmapx cmapx_np dot dot_json eps fig gv imap imap_np ismap json json0 mp pic plain plain-ext pov ps ps2 svg tk xdot xdot1.2 xdot1.4 xdot_json\n"]
        }
      ]);
    });
  });

  describe("renderString", function() {
    it("returns the output for the first graph, even if subsequent graphs have errors", function() {
      const result = viz.renderString("graph a { } graph {");

      assert.strictEqual(result, "graph a {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n");
    });

    it("throws an error if the first graph has a syntax error", function() {
      assert.throws(() => { viz.renderString("graph {"); });
    });

    it("throws an error if the first graph has a layout error", function() {
      assert.throws(() => { viz.renderString("graph { layout=invalid } graph { layout=dot }"); });
    });

    it("throws an error if there are no graphs in the input", function() {
      assert.throws(() => { viz.renderString(""); });
    });

    it("format option", function() {
      assert.match(viz.renderString("digraph { a -> b }"), /digraph {/);
      assert.match(viz.renderString("digraph { a -> b }", { format: "dot" }), /pos="/);
      assert.match(viz.renderString("digraph { a -> b }", { format: "xdot" }), /_draw_="/);
      assert.match(viz.renderString("digraph { a -> b }", { format: "svg" }), /<svg/);
      assert.match(viz.renderString("digraph { a -> b }", { format: "json" }), /"name": "a"/);

      assert.throws(() => { viz.renderString("graph { }", { format: "invalid" }); });
    });

    it("engine option", function() {
      assert.ok(viz.renderString("digraph { a -> b }"));
      assert.ok(viz.renderString("digraph { a -> b }", { engine: "dot" }));
      assert.ok(viz.renderString("digraph { a -> b }", { engine: "neato" }));
      assert.ok(viz.renderString("digraph { a -> b }", { engine: "nop" }));
      assert.ok(viz.renderString("digraph { a -> b }", { engine: "nop2" }));
      assert.ok(viz.renderString("digraph { a -> b }", { engine: "twopi" }));
      assert.ok(viz.renderString("digraph { a -> b }", { engine: "circo" }));
      assert.ok(viz.renderString("digraph { a -> b }", { engine: "fdp" }));
      assert.ok(viz.renderString("digraph { a -> b }", { engine: "sfdp" }));
      assert.ok(viz.renderString("graph { a }", { engine: "patchwork" }));
      assert.ok(viz.renderString("graph { a }", { engine: "osage" }));

      assert.throws(() => { viz.renderString("graph { }", { engine: "invalid" }); });
    });

    it("non-ASCII character", function() {
      assert.match(viz.renderString("digraph { a [label=図] }"), /label=図/);
    });

    it("a graph with unterminated string followed by another call with a valid graph", function() {
      assert.throws(() => { viz.renderString("graph { a[label=\"blah"); });
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

    it("throws an error if the first graph has a syntax error", function() {
      assert.throws(() => { viz.renderSVGElement(`graph { ! }`); });
    });
  });

  describe("renderJSON", function() {
    it("returns an object", function() {
      assert.deepStrictEqual(viz.renderJSON("digraph a { }").name, "a");
    });

    it("throws an error if the first graph has a syntax error", function() {
      assert.throws(() => { viz.renderJSON(`invalid`); });
    });
  });
});
