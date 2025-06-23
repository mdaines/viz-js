import assert from "node:assert/strict";
import { viz } from "../src/constant.js";

describe("constant", function() {
  it("load", async function() {
    // isLoaded returns false if load() hasn't been called
    assert.strictEqual(viz.isLoaded, false);

    // render methods throw if load() hasn't been called
    assert.throws(() => viz.render("digraph { a -> b }"));

    await viz.load();

    assert.strictEqual(viz.isLoaded, true);
    assert.doesNotThrow(() => viz.render("digraph { a -> b }"));

    // can be called multiple times
    await viz.load();

    // returns the instance itself
    assert.strictEqual(await viz.load(), viz);
  });
});
