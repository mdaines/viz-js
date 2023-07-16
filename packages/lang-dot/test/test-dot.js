import { fileTests } from "@lezer/generator/test";
import { buildParser } from "@lezer/generator";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

let testDir = path.dirname(fileURLToPath(import.meta.url));

let parser = buildParser(
  fs.readFileSync(path.join(testDir, "../src/dot.grammar"), "utf8"),
  {
    externalSpecializer(name, terms) {
      if (name == "keywords") {
        let keywordMap = {
          strict: terms.strict,
          graph: terms.graph,
          digraph: terms.digraph,
          subgraph: terms.subgraph,
          node: terms.node,
          edge: terms.edge
        };

        return function(value) {
          let found = keywordMap[value.toLowerCase()];
          return found == null ? -1 : found;
        }
      } else {
        throw new Error(`Undefined external specializer: ${name}`);
      }
    }
  }
);

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
