# Viz.js

This project is a Makefile for building Graphviz with Emscripten and a simple wrapper for using it in the browser.

## API

The sole function, Viz, returns a string.

    Viz(src:string, options={ format="svg", engine="dot" }):string

Some examples:

    Viz("digraph g { a -> b; }");
    Viz("graph G { n0 -- n1 -- n2 -- n3 -- n0; }", { engine: "neato" });
    Viz("digraph g { x -> y -> z; }", { format: "plain" });

These engines are supported:

- dot
- neato

These output formats are known to be supported:

- xdot
- plain
- ps

## Build

To build from source, you will need to install the Emscripten SDK: http://kripken.github.io/emscripten-site/docs/getting_started/index.html

To download the sources and build everything:

    make

## License

Viz.js itself (the Makefile and wrapper) is [BSD licensed](./LICENSE).
