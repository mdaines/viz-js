# Viz.js

This project builds [Graphviz](http://www.graphviz.org) with [Emscripten](https://emscripten.org) and provides a simple wrapper for using it on the web.

This is the development branch for version 3. The version 2 branch is [v2](https://github.com/mdaines/viz.js/tree/v2).


## Build

Make, Docker, and Yarn are prerequisites. After installing the JavaScript dependencies with `yarn install`, run `make` to build everything.

Build products will be in the `lib/` directory:

- `viz-standalone.js` JavaScript source file that can be included with a script tag or imported with a bundler (UMD format).
- `encoded.mjs` JavaScript module file which encodes a copy of the WebAssembly module. It exports a `decode()` function that returns an `ArrayBuffer` which can be used with the Emscripten module.
- `module.mjs` The [Emscripten module](https://emscripten.org/docs/api_reference/module.html).
- `module.wasm` The WebAssembly binary.
