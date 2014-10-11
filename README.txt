This project is a wrapper and Makefile for building Graphviz with Emscripten.

You will need to install the Emscripten SDK:

  http://kripken.github.io/emscripten-site/docs/getting_started/index.html

To download the sources and build everything:

  make

To test:

  node test.js graphs/tiny.dot
