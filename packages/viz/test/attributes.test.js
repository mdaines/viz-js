import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import * as VizPackage from "../src/index.js";

describe("Viz", function() {
  let viz;

  beforeEach(async function() {
    viz = await VizPackage.instance();
  });

  beforeEach(function() {
    const window = (new JSDOM()).window;
    global.DOMParser = window.DOMParser;
  });

  afterEach(function() {
    delete global.DOMParser;
  });

  describe("default attributes", function() {
    it("can be set for graphs, nodes, and edges", function() {
      const src = `digraph {
        graph [id=g]
        a [id=a]
        b [id=b, color=blue]
        a -> b [id=e]
      }`;

      const svg = viz.renderSVGElement(src, {
        graphAttributes: {
          bgcolor: "pink"
        },
        nodeAttributes: {
          color: "green"
        },
        edgeAttributes: {
          color: "yellow"
        }
      });

      assert.ok(svg.querySelector("#g > polygon[fill=pink]"));
      assert.ok(svg.querySelector("#a > ellipse[stroke=green]"));
      assert.ok(svg.querySelector("#b > ellipse[stroke=blue]"));
      assert.ok(svg.querySelector("#e > path[stroke=yellow]"));

      const svg2 = viz.renderSVGElement(src, {
        graphAttributes: {
          bgcolor: "yellow"
        },
        nodeAttributes: {
          color: "red"
        },
        edgeAttributes: {
          color: "orange"
        }
      });

      assert.ok(svg2.querySelector("#g > polygon[fill=yellow]"));
      assert.ok(svg2.querySelector("#a > ellipse[stroke=red]"));
      assert.ok(svg2.querySelector("#b > ellipse[stroke=blue]"));
      assert.ok(svg2.querySelector("#e > path[stroke=orange]"));
    });

    it("can be html strings", function() {
      const svg = viz.renderSVGElement("digraph { a -> b [id=e] }", {
        edgeAttributes: {
          label: { html: "<b>test</b>" }
        }
      });

      assert.strictEqual(svg.querySelector("#e > text[font-weight=bold]").textContent, "test");
    });
  });
});
