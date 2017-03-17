# Viz.js

This project is a Makefile for building [Graphviz](http://www.graphviz.org) with [Emscripten](http://kripken.github.io/emscripten-site/) and a simple wrapper for using it in the browser.

## Become a Patron

Help make Viz.js better by [supporting me on Patreon](https://patreon.com/mdaines). Thank you!

## Getting Viz.js

Install with Bower:

    bower install viz.js

Or with npm:

    npm install viz.js

Or download the `viz.js` "binary" from the [releases page](https://github.com/mdaines/viz.js/releases).

## "Lite" Version

A smaller version of Viz.js can be downloaded from the [releases page](https://github.com/mdaines/viz.js/releases) and is available in the Bower package. `viz-lite.js` omits Expat and the NEATO layout plugin.

## API

### Viz(src, options={ format="svg", engine="dot", scale, images=[{ path, width, height }], totalMemory=16777216 })

- `src` is a string representing the graph to render in the [DOT language](http://www.graphviz.org/content/dot-language).
- `options`
  - `format` sets the output format, and may be one of `"svg"`, `"xdot"`, `"plain"`, `"ps"`, `"json"`, or `"png-image-element"`.
  - `engine` sets the Graphviz engine to use, and may be one of `"circo"`, `"dot"`, `"neato"`, `"osage"`, or `"twopi"`.
  - `scale` sets the scale factor for the `"png-image-element"` format. If this is not specified, `window.devicePixelRatio` will be used if available, and `1` if not.
  - `images` specifies image dimensions to use when rendering nodes with `image` attributes. This is an array of objects, `{ href, width, height }`. `href` may be a filename (`"example.png"`), a relative or absolute path (`"/images/example.png"`), or a URL (`"http://example.com/image.png"`). Dimensions may be specified with units: in, px, pc, pt, cm, or mm. If no units are given or dimensions are given as numbers, points (pt) are used. Graphviz does not actually load image data when this option is used — images are referenced with the dimensions given, eg, in SVG by an `<image>` element with `width` and `height` attributes.
  - `totalMemory` sets the total memory available for the Emscripten module instance. This should be a power of 2. The default of 16MB should be sufficient for most cases — only consider using a larger number if you run into the error "Cannot enlarge memory arrays".

Parses `src` and renders a graph according to the `options` given. Output is a string, except when using the "png-image-element" format, when it is an instance of HTMLImageElement.

For example:

    result = Viz("digraph { a -> b; }");
    result = Viz("digraph { a -> b; }", { format: "png-image-element", scale: 2 });
    result = Viz("graph { n0 -- n1 -- n2 -- n3 -- n0; }", { engine: "neato" });
    result = Viz("digraph { x -> y -> z; }", { format: "plain" });
    result = Viz("digraph { a[image=\"test.png\"]; }", { images: [ { path: "test.png", width: "400px", height: "300px" } ] });

If Graphviz encounters an error, Viz will throw an `Error` object with the error message.

### Viz.svgXmlToPngImageElement(svgXml[, scale[, callback]])

- `svgXml` is an SVG XML string, as may be obtained from the `Viz` function using the `"svg"` format option.
- `scale` sets the scale factor for the output. If this is not specified, `window.devicePixelRatio` will be used if available, and `1` if not.
- `callback` is an optional Node-style callback. If specified, it is given two arguments, `(err, image)`. If not specified, `Viz.svgXmlToPngImageElement` returns an instance of HTMLImageElement.

Converts `svgXml` to a PNG HTMLImageElement. If `callback` is specfied, `image` is loaded by the time the callback is invoked.

### Viz.svgXmlToPngBase64(svgXml, scale, callback)

- `svgXml` is an SVG XML string, as may be obtained from the `Viz` function using the `"svg"` format option.
- `scale` sets the scale factor for the output. If this is given as `undefined`, `window.devicePixelRatio` will be used if available, and `1` if not.
- `callback` is a Node-style callback. It is given two arguments, `(err, data)`.

Converts `svgXml` to a PNG represented as a Base64 string. This function requires a callback, unlike `svgXmlToPngImageElement`.

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
- json

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
