import assert from "node:assert/strict";
import { Viz } from "../src/standalone.mjs";

describe("Viz", function() {
  describe("load", function() {
    it("returns a promise that resolves once the module is loaded", async function() {
      assert.strictEqual(Viz.isLoaded, false);
      assert.throws(() => Viz.render("digraph { a -> b }"));

      await Viz.load();

      assert.strictEqual(Viz.isLoaded, true);
      assert.doesNotThrow(() => Viz.render("digraph { a -> b }"));
    });

    it("returns itself", async function() {
      assert.strictEqual(await Viz.load(), Viz);
    });

    it("can be called multiple times", async function() {
      await Viz.load();
      await Viz.load();
    });
  });
});
