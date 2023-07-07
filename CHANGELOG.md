# Changelog

## Unreleased

* Export the Graphviz version, supported formats, and supported engines as constants generated at build time.

* Include an ES module build as well as UMD.

* Add Typescript declarations.

## 3.0.1

* Catch the error Emscripten throws when exit() is called.

* Don't add an error message about no valid graphs in input.

* Improve error message handling when an error reported from agerr has multiple lines.

## 3.0.0

* Viz.js now uses WebAssembly.

* Adds a new `render()` method that returns the result of rendering, including Graphviz error and warning messages, in a structured format.

* Adds getters for the Graphviz version string, and lists of supported layout engines and output formats.

* Memory leaks that could be identified by calling rendering methods many times have been fixed.

* Can be used as a single JavaScript source file (in UMD format).

* Rendering methods are now synchronous. But constructing an instance of the `Viz` class is now asynchronous, because it depends on compiling and instantiating the WebAssembly code. Use the `instance()` method exported by the main source file, `lib/viz-standalone.js`, which returns a promise that resolves to an instance of the `Viz` class.

* The default value of the `format` option is now `"dot"`, rather than `"svg"`, as with the Graphviz `dot` program. This change only affects the `render()` and `renderString()` methods, since the format for, eg, `renderSVGElement()` is always `"svg"`.

* The `renderJSONObject()` method is now called `renderJSON()`.

* The built-in `Worker` support has been removed.

* The `files` and `images` options have been removed. This allows the Emscripten module to be smaller.

* The `renderImageElement` method has been removed in favor of SVG.

* The `nop` option has been removed. Instead, set the `engine` option to one of `nop`, `nop1`, `nop2`.
