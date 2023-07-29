import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import { readFile } from "node:fs/promises";

async function getBanner() {
  const filePath = new URL("./package.json", import.meta.url);
  const contents = await readFile(filePath, { encoding: "utf8" });
  const packageVersion = JSON.parse(contents).version;

  return `/*!
Viz.js ${packageVersion}
Copyright (c) 2023 Michael Daines

This distribution contains other software in object code form:
Graphviz https://www.graphviz.org
Expat https://libexpat.github.io
*/`;
}

export default [
  {
    input: "src/standalone.mjs",
    output: {
      name: "Viz",
      file: "lib/viz-standalone.js",
      format: "umd",
      banner: getBanner,
      plugins: [
        terser()
      ]
    },
    plugins: [
      babel({
        babelHelpers: "bundled",
        ignore: ["./lib/encoded.mjs"]
      })
    ]
  }
];
