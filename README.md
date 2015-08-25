# Viz.js

This project is a wrapper and Makefile for building Graphviz with Emscripten.

## Build

Generally you won't need to do this. Releases are available from the [releases page](https://github.com/mdaines/viz.js/releases).

To build from source, you will need to install the Emscripten SDK:

  http://kripken.github.io/emscripten-site/docs/getting_started/index.html

To download the sources and build everything:

    make

To test using node:

    node test.js graphs/tiny.dot

## License

Viz.js itself is [BSD licensed](./LICENSE).
