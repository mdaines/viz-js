import assert from "node:assert/strict";
import { instance } from "../src/index.js";

describe("Viz", function() {
  describe("textMeasure", function() {
    it("uses custom text measurement during layout", async function() {
      const viz = await instance();
      const input = 'digraph { node [shape=box fontname="monospace" fontsize=10]; a [label="MMMM"]; }';

      const baseline = viz.renderString(input);
      const measured = viz.renderString(input, {
        textMeasure({ text, fontName, fontSize }) {
          assert.equal(text, "MMMM");
          assert.equal(fontName, "monospace");
          assert.equal(fontSize, 10);

          return {
            width: 500,
            height: 20,
            yoffsetLayout: 15,
            yoffsetCenterline: 1,
          };
        },
      });

      const baselineWidth = extractNodeWidth(baseline);
      const measuredWidth = extractNodeWidth(measured);

      assert.ok(measuredWidth > baselineWidth + 5, `${measuredWidth} <= ${baselineWidth}`);
    });
  });
});

function extractNodeWidth(dot) {
  const match = dot.match(/\bwidth=([0-9.]+)/);

  assert.ok(match, `width not found in:\n${dot}`);

  return Number(match[1]);
}
