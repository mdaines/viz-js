import { getInputFromSearch, encode, decode } from "../src/links.js";
import assert from "node:assert/strict";

describe("getInputFromSearch", function() {
  it("returns the expected input", function() {
    const search = "dot=ZGlncmFwaCB7IGEgLT4gYiB9";
    const expected = "digraph { a -> b }";

    assert.deepStrictEqual(getInputFromSearch(search), expected);
  });

  it("handles characters outside of ASCII range", function() {
    const search = "dot=ZGlncmFwaCB7IOmfs-alvSAtPiDimasgfQ~~";
    const expected = "digraph { 音楽 -> ♫ }";

    assert.deepStrictEqual(getInputFromSearch(search), expected);
  });

  it("returns the default value if the expected param isn't present", function() {
    assert.deepStrictEqual(getInputFromSearch("", "fake default value"), "fake default value");
  });
});

describe("encode", function() {
  it("handles characters outside of ASCII range", function() {
    assert.deepStrictEqual(encode("digraph { 音楽 -> ♫ }"), "ZGlncmFwaCB7IOmfs-alvSAtPiDimasgfQ~~");
  });
});

describe("decode", function() {
  it("handles characters outside of ASCII range", function() {
    assert.deepStrictEqual(decode("ZGlncmFwaCB7IOmfs-alvSAtPiDimasgfQ~~"), "digraph { 音楽 -> ♫ }");
  });
});
