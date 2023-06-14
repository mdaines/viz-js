# Viz.js

This project builds [Graphviz](http://www.graphviz.org) with [Emscripten](https://emscripten.org) and provides a simple wrapper for using it on the web.

## Install

Viz.js is published on NPM as `@viz-js/viz`. You can also download it from the [releases page](https://github.com/mdaines/viz-js/releases).

## Usage

Call `Viz.instance()`, which returns a `Promise` that resolves to a new `Viz` instance. Then call any of the instance's `render` methods to render a graph written in [the DOT language](https://www.graphviz.org/doc/info/lang.html). The `renderSVGElement()` method is convenient for displaying a graph in a webpage. The instance can be reused for multiple `render` calls.

```js
<script src="viz-standalone.js"></script>
<script>

  Viz.instance().then(function(viz) {
    document.body.appendChild(viz.renderSVGElement("digraph { a -> b }"));
  });

</script>
```

See the examples directory for more.

## API

### `Viz.instance()`

Returns a `Promise` that resolves to a new `Viz` instance.

### `viz.render(src[, options])`

* `src: string`: the graph to render in DOT format
* `options.format: string`: the output format to render (default is "dot")
* `options.engine: string`: the engine to use for graph layout (default is "dot")
* `options.yInvert: boolean`: invert y coordinates in output (default is false)

Returns an object with the result of rendering:

* `status: "success" | "failure"`: string indicating whether rendering succeeded or failed
* `output: string | undefined`: the rendered output, or undefined if rendering failed
* `errors: Array<{ level?: "error" | "warning", message: string }>`: an array of error message objects

### `viz.renderString(src[, options])`

Returns a string with the output of rendering. If rendering failed, throws an error. This accepts the same options as `viz.render`.

### `viz.renderSVGElement(src[, options])`

Convenience method that parses the output and returns an SVG element that can be inserted into the document. This accepts the same options as `viz.render`, except that the `format` option is always `"svg"`.

### `viz.renderJSON(src[, options])`

Convenience method that parses the output and returns a JSON object. This accepts the same options as `viz.render`, except that the `format` option is always `"json"`.

### `viz.graphvizVersion`

Returns a string indicating the version of Graphviz used for this build of Viz.js. For example, `"8.0.4"`.

### `viz.engines`

Returns an array of strings indicating the supported Graphviz layout engines.

### `viz.formats`

Returns an array of strings indicating the supported Graphviz output formats.

## Build

Make, Docker, and Yarn are prerequisites. After installing the JavaScript dependencies with `yarn install`, run `make` to build everything.

Build products will be in the `lib/` directory:

- `viz-standalone.js` JavaScript source file that can be included with a script tag or imported with a bundler (UMD format).
- `encoded.mjs` JavaScript module file which encodes a copy of the WebAssembly module. It exports a `decode()` function that returns an `ArrayBuffer` which can be used with the Emscripten module.
- `module.mjs` The [Emscripten module](https://emscripten.org/docs/api_reference/module.html).
- `module.wasm` The WebAssembly binary.
