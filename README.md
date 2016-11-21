# Viz.js

This project is a Makefile for building [Graphviz](http://www.graphviz.org) with [Emscripten](http://kripken.github.io/emscripten-site/) and a simple wrapper for using it in the browser.

## Getting Viz.js

Install with Bower:

    bower install viz.js

Or with npm:

    npm install viz.js

Or download the `viz.js` "binary" from the [releases page](https://github.com/mdaines/viz.js/releases).

## API

Viz.js defines a single function to handle most cases:

    Viz(src, options={ format="svg", engine="dot", scale })

- `src` is a string representing the graph to render in the DOT language.
- `options`
  - `format` sets the output format, and may be one of `"svg"`, `"xdot"`, `"plain"`, `"ps"`, or `"png-image-element"`.
  - `engine` sets the Graphviz engine to use, and may be one of `"circo"`, `"dot"`, `"neato"`, `"osage"`, or `"twopi"`.
  - `scale` sets the scale factor for the `"png-image-element"` format. If this is not specified, `window.devicePixelRatio` will be used if available, and `1` if not.

Output is returned as a string, except when using the "png-image-element" format, when it is returned as an instance of HTMLImageElement.

For example:

    result = Viz("digraph { a -> b; }");
    result = Viz("digraph { a -> b; }", { format: "png-image-element", scale: 2 });
    result = Viz("graph { n0 -- n1 -- n2 -- n3 -- n0; }", { engine: "neato" });
    result = Viz("digraph { x -> y -> z; }", { format: "plain" });

If Graphviz encounters an error, the error message will be thrown as an exception.

## Supported Graphviz features

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

## PNG output

Viz.js provides the `"png-image-element"` format in addition to the regular Graphviz formats. This returns an `HTMLImageElement` which can be inserted into the document.

    image = Viz("digraph g { a -> b; }", { format: "png-image-element" });
    document.body.appendChild(image);

However, this won't work in a Web Worker context. In that case, ask for the `"svg"` format in the worker and convert using the accessory function `Viz.svgXmlToPngImageElement` in the window context. See tests/png.js for an example.

### Internet Explorer support

Internet Explorer 10 and 11 require [Fabric.js](http://fabricjs.com) as an optional dependency for PNG output. Viz.js will look for a `fabric` object as a member of the global object with a `loadSVGFromString()` function and use that if present.

## Build

To build from source, you will need to [install the Emscripten SDK](http://kripken.github.io/emscripten-site/docs/getting_started/index.html).

To download the sources and build everything:

    make

## Donate

If you find Viz.js useful, please consider a donation. Thank you!

<a href="https://pledgie.com/campaigns/32883"><img alt="Click here to lend your support to: Viz.js and make a donation at pledgie.com !" src="https://pledgie.com/campaigns/32883.png?skin_name=chrome" border="0"></a>
