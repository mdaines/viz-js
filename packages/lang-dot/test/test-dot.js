import { fileTests } from "@lezer/generator/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { parser } from "../src/parser.js";

let testDir = path.dirname(fileURLToPath(import.meta.url));

for (let file of fs.readdirSync(testDir)) {
  if (!/\.txt$/.test(file)) {
    continue;
  }

  let name = /^[^\.]*/.exec(file)[0];
  describe(name, function() {
    for (let { name, run } of fileTests(fs.readFileSync(path.join(testDir, file), "utf8"), file)) {
      it(name, function() {
        run(parser);
      });
    }
  });
}

describe("case-insensitive keyword specialization", function() {
  it("parse should not fail for nodes with names that are properties of Object", function() {
    const strictParser = parser.configure({ strict: true });

    strictParser.parse("digraph { constructor }");
    strictParser.parse("digraph { __proto__ }");
    strictParser.parse("digraph { hasOwnProperty }");
  });
});
