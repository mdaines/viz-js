# Viz.js

This project is a Makefile for building Graphviz with Emscripten and a simple wrapper for using it in the browser.

## Getting Viz.js

Install with Bower:

    bower install viz.js

Or with npm:

    npm install viz.js

Or download the `viz.js` "binary" from the [releases page](https://github.com/mdaines/viz.js/releases).

## API

There is one function, `Viz`, which returns output as a string.

    Viz(src, options={ format="svg", engine="dot" })

Some examples:

    result = Viz("digraph g { a -> b; }");
    result = Viz("graph G { n0 -- n1 -- n2 -- n3 -- n0; }", { engine: "neato" });
    result = Viz("digraph g { x -> y -> z; }", { format: "plain" });

If `src` has a syntax error, Graphviz's error message will be thrown as an exception.

These engines are supported:

- circo
- dot
- fdp
- neato
- osage
- twopi

These formats are supported:

- svg
- xdot
- plain
- ps

## Build

To build from source, you will need to install the Emscripten SDK: http://kripken.github.io/emscripten-site/docs/getting_started/index.html

To download the sources and build everything:

    make

## License

Viz.js itself (the wrapper and Makefile, not the compiled versions of Graphviz, Expat, zlib, etc.) is [BSD licensed](./LICENSE).
