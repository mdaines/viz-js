import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import * as VizPackage from "../src/index.js";

function textContents(svg, selector) {
  return Array.from(svg.querySelectorAll(selector)).map(e => e.textContent);
}

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

  describe("rendering graph objects", function() {
    it("empty graph", function() {
      const svg = viz.renderSVGElement({});

      assert.deepStrictEqual(textContents(svg, ".edge title"), []);
      assert.deepStrictEqual(textContents(svg, ".node text"), []);
    });

    it("just edges", function() {
      const svg = viz.renderSVGElement({
        edges: [
          { tail: "a", head: "b" }
        ]
      });

      assert.deepStrictEqual(textContents(svg, ".edge title"), ["a->b"]);
      assert.deepStrictEqual(textContents(svg, ".node text"), ["a", "b"]);
    });

    it("undirected graph", function() {
      const svg = viz.renderSVGElement({
        directed: false,
        edges: [
          { tail: "a", head: "b" }
        ]
      });

      assert.deepStrictEqual(textContents(svg, ".edge title"), ["a--b"]);
      assert.deepStrictEqual(textContents(svg, ".node text"), ["a", "b"]);
    });

    it("html attributes", function() {
      const svg = viz.renderSVGElement({
        nodes: [
          {
            name: "a",
            attributes: {
              label: { html: "<b>A</b>" }
            }
          }
        ]
      });

      assert.deepStrictEqual(textContents(svg, ".node text[font-weight=bold]"), ["A"]);
    });

    it("default attributes in graph", function() {
      const svg = viz.renderSVGElement({
        nodes: [
          {
            name: "a",
            attributes: {
              id: "a",
              shape: "rectangle"
            }
          }
        ],
        nodeAttributes: {
          shape: "circle",
          color: "blue"
        }
      });

      assert.deepStrictEqual(textContents(svg, ".node text"), ["a"]);

      assert.ok(svg.querySelector("#a polygon[stroke=blue]"));
    });

    it("default attributes in options", function() {
      const svg = viz.renderSVGElement({
        nodes: [
          {
            name: "a",
            attributes: {
              shape: "rectangle"
            }
          }
        ]
      },
      {
        nodeAttributes: {
          shape: "circle",
          color: "blue"
        }
      });

      assert.deepStrictEqual(textContents(svg, ".node text"), ["a"]);

      assert.ok(svg.querySelector(".node > polygon[stroke=blue]"));
    });

    it("default attributes, nodes, edges, and nested subgraphs", function() {
      const svg = viz.renderSVGElement({
        graphAttributes: {
          id: "g",
          rankdir: "LR"
        },
        nodeAttributes: {
          shape: "rectangle"
        },
        nodes: [
          { name: "a", attributes: { label: "A", color: "red" } },
          { name: "b", attributes: { label: "B", color: "green" } }
        ],
        edges: [
          { tail: "a", head: "b", attributes: { label: "1" } },
          { tail: "b", head: "c", attributes: { label: "2" } }
        ],
        subgraphs: [
          {
            name: "cluster_1",
            nodes: [
              { name: "c", attributes: { label: "C", color: "blue" } }
            ],
            edges: [
              { tail: "c", head: "d", attributes: { label: "3" } }
            ],
            subgraphs: [
              {
                name: "cluster_2",
                nodes: [
                  { name: "d", attributes: { label: "D", color: "orange" } }
                ]
              }
            ]
          }
        ]
      });

      assert.deepStrictEqual(textContents(svg, ".cluster title"), ["cluster_1", "cluster_2"]);
      assert.deepStrictEqual(textContents(svg, ".edge title"), ["a->b", "b->c", "c->d"]);
      assert.deepStrictEqual(textContents(svg, ".node title"), ["a", "b", "c", "d"]);
    });

    it("throws for a node without a name", function() {
      assert.throws(() => {
        viz.render({
          nodes: [
            {}
          ]
        });
      });
    });

    it("throws for an edge without tail or head", function() {
      assert.throws(() => {
        viz.render({
          edges: [
            {}
          ]
        });
      });

      assert.throws(() => {
        viz.render({
          edges: [
            { tail: "a" }
          ]
        });
      });

      assert.throws(() => {
        viz.render({
          edges: [
            { head: "b" }
          ]
        });
      });
    });

    it("accepts a subgraph without a name", function() {
      const svg = viz.renderSVGElement({
        subgraphs: [
          {
            nodes: [
              { name: "a" }
            ]
          },
          {
            nodes: [
              { name: "b" }
            ]
          }
        ]
      });

      assert.deepStrictEqual(textContents(svg, ".node text"), ["a", "b"]);
    });

    it("applies subgraph attributes correctly", function() {
      const svg = viz.renderSVGElement({
        nodes: [
          { name: "a", attributes: { id: "a" } }
        ],
        subgraphs: [
          {
            graphAttributes: {
              cluster: true,
              id: "subg",
              color: "red"
            },
            nodeAttributes: {
              color: "green"
            },
            edgeAttributes: {
              color: "blue"
            },
            nodes: [
              { name: "b", attributes: { id: "b" } },
              { name: "c", attributes: { id: "c" } }
            ],
            edges: [
              { tail: "b", head: "c", attributes: { id: "e" } }
            ]
          }
        ]
      });

      assert.ok(svg.querySelector("#subg > polygon[stroke=red]"));
      assert.ok(svg.querySelector("#a > ellipse[stroke=black]"));
      assert.ok(svg.querySelector("#b > ellipse[stroke=green]"));
      assert.ok(svg.querySelector("#c > ellipse[stroke=green]"));
      assert.ok(svg.querySelector("#e > path[stroke=blue]"));
    });
  });
});
