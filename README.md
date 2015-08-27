# Viz.js

This project is a Makefile for building Graphviz 2.38.0 with Emscripten and a simple wrapper for using it in the browser.

## API

    var svg = Viz("digraph g { a -> b; }");

## Build

To build from source, you will need to install the Emscripten SDK:

  http://kripken.github.io/emscripten-site/docs/getting_started/index.html

To download the sources and build everything:

    make

## License

Viz.js itself (the Makefile and wrapper) is [BSD licensed](./LICENSE).
