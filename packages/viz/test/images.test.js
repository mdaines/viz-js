import assert from "node:assert/strict";
import * as VizPackage from "../src/index.js";

describe("Viz", function() {
  let viz;

  beforeEach(async function() {
    viz = await VizPackage.instance();
  });

  describe("images", function() {
    it("accepts an images option", function() {
      const result = viz.render("graph { a[image=\"test.png\"] }", {
        images: [
          { name: "test.png", width: 300, height: 200 }
        ]
      });

      assert.deepStrictEqual(result, {
        status: "success",
        output: `graph {
	graph [bb="0,0,321.03,214.96"];
	node [label="\\N"];
	a	[height=2.9856,
		image="test.png",
		pos="160.51,107.48",
		width=4.4587];
}
`,
        errors: []
      });
    });

    it("accepts two images with the same name", function() {
      const result = viz.render("graph { a[image=\"test.png\"] }", {
        images: [
          { name: "test.png", width: 300, height: 200 },
          { name: "test.png", width: 300, height: 200 }
        ]
      });

      assert.deepStrictEqual(result, {
        status: "success",
        output: `graph {
	graph [bb="0,0,321.03,214.96"];
	node [label="\\N"];
	a	[height=2.9856,
		image="test.png",
		pos="160.51,107.48",
		width=4.4587];
}
`,
        errors: []
      });
    });

    it("the same image can be used twice", function() {
      const result = viz.render("graph { a[image=\"test.png\"]; b[image=\"test.png\"] }", {
        images: [
          { name: "test.png", width: 300, height: 200 }
        ]
      });

      assert.deepStrictEqual(result, {
        status: "success",
        output: `graph {
	graph [bb="0,0,660.03,214.96"];
	node [label="\\N"];
	a	[height=2.9856,
		image="test.png",
		pos="160.51,107.48",
		width=4.4587];
	b	[height=2.9856,
		image="test.png",
		pos="499.51,107.48",
		width=4.4587];
}
`,
        errors: []
      });
    });

    it("accepts URLs for image names", function() {
      const result = viz.render("graph { a[image=\"http://example.com/test.png\"] }", {
        images: [
          { name: "http://example.com/test.png", width: 300, height: 200 }
        ]
      });

      assert.deepStrictEqual(result, {
        status: "success",
        output: `graph {
	graph [bb="0,0,321.03,214.96"];
	node [label="\\N"];
	a	[height=2.9856,
		image="http://example.com/test.png",
		pos="160.51,107.48",
		width=4.4587];
}
`,
        errors: []
      });
    });

    it("throws for invalid image objects", function() {
      assert.throws(() => viz.render("...", { images: [{ src: "test.png", width: 123, height: 456 }] }), /image name/);
      assert.throws(() => viz.render("...", { images: [{ name: "test.png", height: 123 }] }), /image width/);
      assert.throws(() => viz.render("...", { images: [{ name: "test.png", width: 456 }] }), /image height/);
      assert.throws(() => viz.render("...", { images: ["test.png"] }), /image name/);
    });

    it("does not leave valid images in place when an error was previously thrown for an invalid image", function() {
      assert.throws(() => {
        viz.render("graph { a[image=\"http://example.com/test.png\"] }", {
          images: [
            { name: "http://example.com/test.png", width: 300, height: 200 },
            { name: "http://example.com/test2.png" }
          ]
        });
      });

      const result = viz.render("graph { a[image=\"http://example.com/test.png\"] }");

      assert.deepStrictEqual(result.errors, [
        { level: "warning", message: `No such file or directory while opening http://example.com/test.png` },
        { level: "warning", message: `No or improper image="http://example.com/test.png" for node "a"` }
      ]);
    });
  });
});
