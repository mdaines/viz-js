import * as Viz from "../src/standalone.mjs";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

describe("standalone", function() {
  describe("graphvizVersion", function() {
    it("returns the Graphviz version", function() {
      assert.strictEqual(Viz.graphvizVersion, "8.1.0");
    });
  });

  describe("formats", function() {
    it("returns the list of formats", function() {
      assert.deepStrictEqual(Viz.formats, [
        "canon",
        "cmap",
        "cmapx",
        "cmapx_np",
        "dot",
        "dot_json",
        "eps",
        "fig",
        "gv",
        "imap",
        "imap_np",
        "ismap",
        "json",
        "json0",
        "mp",
        "pic",
        "plain",
        "plain-ext",
        "pov",
        "ps",
        "ps2",
        "svg",
        "tk",
        "xdot",
        "xdot1.2",
        "xdot1.4",
        "xdot_json"
      ]);
    });
  });

  describe("engines", function() {
    it("returns the list of layout engines", function() {
      assert.deepStrictEqual(Viz.engines, [
        "circo",
        "dot",
        "fdp",
        "neato",
        "nop",
        "nop1",
        "nop2",
        "osage",
        "patchwork",
        "sfdp",
        "twopi"
      ]);
    });
  });

  describe("instance", function() {
    let viz;

    beforeEach(async function() {
      viz = await Viz.instance();
    });

    describe("render", function() {
      it("renders valid input with a single graph", function() {
        const result = viz.render("graph a { }");

        assert.deepStrictEqual(result, {
          status: "success",
          output: "graph a {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n",
          errors: []
        });
      });

      it("renders valid input with multiple graphs", function() {
        const result = viz.render("graph a { } graph b { }");

        assert.deepStrictEqual(result, {
          status: "success",
          output: "graph a {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n",
          errors: []
        });
      });

      it("each call renders the first graph in input", function() {
        assert.match(viz.render("graph a { } graph b { } graph c { }").output, /graph a {/);
        assert.match(viz.render("graph d { } graph e { }").output, /graph d {/);
        assert.match(viz.render("graph f { }").output, /graph f {/);
      });

      it("accepts the format option, defaulting to dot", function() {
        assert.match(viz.render("digraph { a -> b }").output, /pos="/);
        assert.match(viz.render("digraph { a -> b }", { format: "dot" }).output, /pos="/);
        assert.match(viz.render("digraph { a -> b }", { format: "xdot" }).output, /_draw_="/);
        assert.match(viz.render("digraph { a -> b }", { format: "svg" }).output, /<svg/);
        assert.match(viz.render("digraph { a -> b }", { format: "json" }).output, /"name": "a"/);
      });

      it("accepts other engine options", function() {
        const src = "digraph { a -> b }";
        const dotOutput = viz.render(src).output;

        assert.strictEqual(viz.render(src, { engine: "dot" }).output, dotOutput);
        assert.notStrictEqual(viz.render(src, { engine: "neato" }).output, dotOutput);
        assert.notStrictEqual(viz.render(src, { engine: "nop2" }).output, dotOutput);
        assert.notStrictEqual(viz.render(src, { engine: "twopi" }).output, dotOutput);
        assert.notStrictEqual(viz.render(src, { engine: "circo" }).output, dotOutput);
        assert.notStrictEqual(viz.render(src, { engine: "fdp" }).output, dotOutput);
        assert.notStrictEqual(viz.render(src, { engine: "sfdp" }).output, dotOutput);
        assert.notStrictEqual(viz.render(src, { engine: "patchwork" }).output, dotOutput);
        assert.notStrictEqual(viz.render(src, { engine: "osage" }).output, dotOutput);
      });

      it("accepts yInvert option", function() {
        const result1 = viz.render("graph { a }", { yInvert: false });
        const result2 = viz.render("graph { a }", { yInvert: true });

        assert.deepStrictEqual(result1, {
          status: "success",
          output: "graph {\n\tgraph [bb=\"0,0,54,36\"];\n\tnode [label=\"\\N\"];\n\ta\t[height=0.5,\n\t\tpos=\"27,18\",\n\t\twidth=0.75];\n}\n",
          errors: []
        });

        assert.deepStrictEqual(result2, {
          status: "success",
          output: "graph {\n\tgraph [bb=\"0,36,54,0\"];\n\tnode [label=\"\\N\"];\n\ta\t[height=0.5,\n\t\tpos=\"27,18\",\n\t\twidth=0.75];\n}\n",
          errors: []
        });
      });

      it("accepts default attributes", function() {
        const result = viz.render("graph {}", {
          defaultAttributes: {
            graph: {
              a: 123
            },
            node: {
              b: false
            },
            edge: {
              c: "test"
            }
          }
        });

        assert.deepStrictEqual(result, {
          status: "success",
          output: `graph {
	graph [a=123,
		bb="0,0,0,0"
	];
	node [b=false,
		label="\\N"
	];
	edge [c=test];
}
`,
          errors: []
        });
      });

      it("returns an error for empty input", function() {
        const result = viz.render("");

        assert.deepStrictEqual(result, {
          status: "failure",
          output: undefined,
          errors: []
        });
      });

      it("returns error messages for invalid input", function() {
        const result = viz.render("invalid");

        assert.deepStrictEqual(result, {
          status: "failure",
          output: undefined,
          errors: [
            { level: "error", message: "syntax error in line 1 near 'invalid'" }
          ]
        });
      });

      it("throws if input is the wrong type", function() {
        assert.throws(() => { viz.render(undefined); }, /^Error: input must be a string or object/);
      });

      it("returns only the error messages emitted for the current call", function() {
        const result1 = viz.render("invalid1");
        const result2 = viz.render("invalid2");

        assert.deepStrictEqual(result1, {
          status: "failure",
          output: undefined,
          errors: [
            { level: "error", message: "syntax error in line 1 near 'invalid1'" }
          ]
        });

        assert.deepStrictEqual(result2, {
          status: "failure",
          output: undefined,
          errors: [
            { level: "error", message: "syntax error in line 1 near 'invalid2'" }
          ]
        });
      });

      it("renders valid input but includes error messges when followed by a graph with a syntax error", function() {
        const result = viz.render("graph a { } graph {");

        assert.deepStrictEqual(result, {
          status: "success",
          output: "graph a {\n\tgraph [bb=\"0,0,0,0\"];\n\tnode [label=\"\\N\"];\n}\n",
          errors: [
            { level: "error", message: "syntax error in line 1" }
          ]
        });
      });

      it("returns error messages for layout errors", function() {
        const result = viz.render("graph a { layout=invalid } graph b { layout=dot }");

        assert.deepStrictEqual(result, {
          status: "failure",
          output: undefined,
          errors: [
            { level: "error", message: "Layout type: \"invalid\" not recognized. Use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi" }
          ]
        });
      });

      it("renders graphs with syntax warnings", function() {
        const result = viz.render("graph a { x=1.2.3=y } graph b { }");

        assert.deepStrictEqual(result, {
          status: "success",
          output: "graph a {\n\tgraph [.3=y,\n\t\tbb=\"0,0,0,0\",\n\t\tx=1.2\n\t];\n\tnode [label=\"\\N\"];\n}\n",
          errors: [
            { level: "warning", message: "syntax ambiguity - badly delimited number '1.2.' in line 1 of input splits into two tokens" }
          ]
        });
      });

      it("returns both warnings and errors", function() {
        const result = viz.render("graph { layout=invalid; x=1.2.3=y }");

        assert.deepStrictEqual(result, {
          status: "failure",
          output: undefined,
          errors: [
            { level: "warning", message: "syntax ambiguity - badly delimited number '1.2.' in line 1 of input splits into two tokens" },
            { level: "error", message: "Layout type: \"invalid\" not recognized. Use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi" }
          ]
        });
      });

      it("returns error messages printed to stderr", function() {
        const result = viz.render("graph { a [label=図] }", { format: "plain" });

        assert.deepStrictEqual(result, {
          status: "success",
          output: `graph 1 0.75 0.5
node a 0.375 0.25 0.75 0.5 図 solid ellipse black lightgrey
stop
`,
          errors: [
            { level: "warning", message: "no value for width of non-ASCII character 229. Falling back to width of space character" }
          ]
        });
      });

      it("returns error messages for invalid engine option", function() {
        const result = viz.render("graph { }", { engine: "invalid" });

        assert.deepStrictEqual(result, {
          status: "failure",
          output: undefined,
          errors: [
            { level: "error", message: "Layout type: \"invalid\" not recognized. Use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi" }
          ]
        });
      });

      it("returns error messages for invalid format option", function() {
        const result = viz.render("graph { }", { format: "invalid" });

        assert.deepStrictEqual(result,{
          status: "failure",
          output: undefined,
          errors: [
            { level: "error", message: "Format: \"invalid\" not recognized. Use one of: canon cmap cmapx cmapx_np dot dot_json eps fig gv imap imap_np ismap json json0 mp pic plain plain-ext pov ps ps2 svg tk xdot xdot1.2 xdot1.4 xdot_json" }
          ]
        });
      });

      it("returns an error that contains newlines as a single item", function() {
        const result = viz.render("graph { \" }");

        assert.deepStrictEqual(result,{
          status: "failure",
          output: undefined,
          errors: [
            { level: "error", message: "syntax error in line 1 scanning a quoted string (missing endquote? longer than 16384?)\nString starting:\" }" }
          ]
        });
      });

      it("returns an error that uses AGPREV with the correct level", function() {
        const result = viz.render("graph { _background=123 }");

        assert.deepStrictEqual(result,{
          status: "success",
          output: "graph {\n\tgraph [_background=123,\n\t\tbb=\"0,0,0,0\"\n\t];\n\tnode [label=\"\\N\"];\n}\n",
          errors: [
            { level: "warning", message: "Could not parse \"_background\" attribute in graph %1" },
            { level: "warning", message: "  \"123\"" }
          ]
        });
      });

      it("returns an error if exit() is called", function() {
        const result = viz.render("graph { a[label=<>] }");

        assert.deepStrictEqual(result,{
          status: "failure",
          output: undefined,
          errors: [
            { level: "error", message: "syntax error in line 1" },
            { level: "error", message: "... <HTML></HTML> ..." }
          ]
        });
      });

      describe("object input", function() {
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

        it("default attributes render options override options in input", function() {
          const result = viz.render(
            {
              defaultAttributes: {
                node: {
                  shape: "rectangle"
                }
              }
            },
            {
              defaultAttributes: {
                node: {
                  shape: "circle"
                }
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
	a -> b	[pos="e,27,36.104 27,71.697 27,64.237 27,55.322 27,46.965"];
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

        it("default attributes, graph attributes, nodes, edges, and nested subgraphs", function() {
          const result = viz.render({
            defaultAttributes: {
              node: {
                shape: "circle"
              }
            },
            attributes: {
              rankdir: "LR"
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
			pos="e,236.63,42 194.5,42 203.75,42 215.35,42 225.84,42"];
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
		pos="e,78.615,42 36.485,42 45.741,42 57.335,42 67.826,42"];
	b -> c	[label=2,
		lp="136.52,50.4",
		pos="e,157.62,42 115.49,42 124.75,42 136.34,42 146.83,42"];
}
`,
            errors: []
          });
        });
      });
    });

    describe("graphvizVersion", function() {
      it("returns the Graphviz version", function() {
        assert.strictEqual(viz.graphvizVersion, "8.1.0");
      });
    });

    describe("formats", function() {
      it("returns the list of formats", function() {
        assert.deepStrictEqual(viz.formats, [
          "canon",
          "cmap",
          "cmapx",
          "cmapx_np",
          "dot",
          "dot_json",
          "eps",
          "fig",
          "gv",
          "imap",
          "imap_np",
          "ismap",
          "json",
          "json0",
          "mp",
          "pic",
          "plain",
          "plain-ext",
          "pov",
          "ps",
          "ps2",
          "svg",
          "tk",
          "xdot",
          "xdot1.2",
          "xdot1.4",
          "xdot_json"
        ]);
      });
    });

    describe("engines", function() {
      it("returns the list of layout engines", function() {
        assert.deepStrictEqual(viz.engines, [
          "circo",
          "dot",
          "fdp",
          "neato",
          "nop",
          "nop1",
          "nop2",
          "osage",
          "patchwork",
          "sfdp",
          "twopi"
        ]);
      });
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
});
