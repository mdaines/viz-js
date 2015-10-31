# Viz.js

This project is a Makefile for building Graphviz with Emscripten and a simple wrapper for using it in the browser.

## Getting Viz.js

Install with Bower:

    bower install viz.js

Or with npm:

    npm install viz.js

Or download the `viz.js` "binary" from the [releases page](https://github.com/mdaines/viz.js/releases).

## API

The main function, `Viz`, returns output as a string.

    Viz(src, options={ format="svg", engine="dot" })

Some examples:

    result = Viz("digraph g { a -> b; }");
    result = Viz("graph G { n0 -- n1 -- n2 -- n3 -- n0; }", { engine: "neato" });
    result = Viz("digraph g { x -> y -> z; }", { format: "plain" });

If Graphviz encounters an error, the error message will be thrown as an exception.

### PNG output

Viz.js provides the `"png-image-element"` format in addition to the regular Graphviz formats. This returns an HTMLImageElement which can be inserted into the document.

    image = Viz("digraph g { a -> b; }", { format: "png-image-element" });
    document.body.appendChild(image);

However, this won't work in a Web Worker context. In that case, ask for the `"svg"` format in the worker and convert using the accessory function `Viz.svgXmlToPngImageElement` in the window context. See tests/png.js for an example.

### Supported Graphviz features

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
