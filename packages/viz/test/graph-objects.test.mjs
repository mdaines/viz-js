import assert from "node:assert/strict";
import * as VizPackage from "../src/standalone.mjs";

describe("Viz", function() {
  let viz;

  beforeEach(async function() {
    viz = await VizPackage.instance();
  });

  describe("rendering graph objects", function() {
    it("empty graph", function() {
      const result = viz.render({});

      assert.deepStrictEqual(result, {
        status: "success",
        output: `digraph {
	graph [bb="0,0,0,0"];
	node [label="\\N"];
}
`,
        errors: []
      });
    });

    it("attributes in options override options in input", function() {
      const result = viz.render(
        {
          nodeAttributes: {
            shape: "rectangle"
          }
        },
        {
          nodeAttributes: {
            shape: "circle"
          }
        }
      );

      assert.deepStrictEqual(result, {
        status: "success",
        output: `digraph {
	graph [bb="0,0,0,0"];
	node [label="\\N",
		shape=circle
	];
}
`,
        errors: []
      });
    });

    it("just edges", function() {
      const result = viz.render({
        edges: [
          { tail: "a", head: "b" }
        ]
      });

      assert.deepStrictEqual(result, {
        status: "success",
        output: `digraph {
	graph [bb="0,0,54,108"];
	node [label="\\N"];
	a	[height=0.5,
		pos="27,90",
		width=0.75];
	b	[height=0.5,
		pos="27,18",
		width=0.75];
	a -> b	[pos="e,27,36.104 27,71.697 27,64.407 27,55.726 27,47.536"];
}
`,
        errors: []
      });
    });

    it("undirected graph", function() {
      const result = viz.render({
        directed: false,
        edges: [
          { tail: "a", head: "b" }
        ]
      });

      assert.deepStrictEqual(result, {
        status: "success",
        output: `graph {
	graph [bb="0,0,54,108"];
	node [label="\\N"];
	a	[height=0.5,
		pos="27,90",
		width=0.75];
	b	[height=0.5,
		pos="27,18",
		width=0.75];
	a -- b	[pos="27,71.697 27,60.846 27,46.917 27,36.104"];
}
`,
        errors: []
      });
    });

    it("html attributes", function() {
      const result = viz.render({
        nodes: [
          {
            name: "a",
            attributes: {
              label: { html: "<b>A</b>" }
            }
          }
        ]
      });

      assert.deepStrictEqual(result, {
        status: "success",
        output: `digraph {
	graph [bb="0,0,54,36"];
	a	[height=0.5,
		label=<<b>A</b>>,
		pos="27,18",
		width=0.75];
}
`,
        errors: []
      });
    });

    it("default attributes, nodes, edges, and nested subgraphs", function() {
      const result = viz.render({
        graphAttributes: {
          rankdir: "LR"
        },
        nodeAttributes: {
          shape: "circle"
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

      assert.deepStrictEqual(result, {
        status: "success",
        output: `digraph {
	graph [bb="0,0,297.04,84",
		rankdir=LR
	];
	node [shape=circle];
	subgraph cluster_1 {
		graph [bb="150.02,8,289.04,76"];
		subgraph cluster_2 {
			graph [bb="229.02,16,281.04,68"];
			d	[color=orange,
				height=0.50029,
				label=D,
				pos="255.03,42",
				width=0.50029];
		}
		c	[color=blue,
			height=0.5,
			label=C,
			pos="176.02,42",
			width=0.5];
		c -> d	[label=3,
			lp="215.52,50.4",
			pos="e,236.63,42 194.5,42 203.55,42 214.85,42 225.17,42"];
	}
	a	[color=red,
		height=0.50029,
		label=A,
		pos="18.01,42",
		width=0.50029];
	b	[color=green,
		height=0.5,
		label=B,
		pos="97.021,42",
		width=0.5];
	a -> b	[label=1,
		lp="57.521,50.4",
		pos="e,78.615,42 36.485,42 45.544,42 56.842,42 67.155,42"];
	b -> c	[label=2,
		lp="136.52,50.4",
		pos="e,157.62,42 115.49,42 124.55,42 135.85,42 146.16,42"];
}
`,
        errors: []
      });
    });
  });
});
