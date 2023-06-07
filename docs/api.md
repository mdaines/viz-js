# API

## `Viz.instance()`

Returns a `Promise` which fulfills with a new `Viz` instance.

## `viz.render(src[, options])`

* `src: string`: the graph to render in DOT format
* `options.format: string`: the output format to render (default is "dot")
* `options.engine: string`: the engine to use for graph layout (default is "dot")
* `options.yInvert: boolean`: invert y coordinates in output (default is false)
* `options.nop: number`: if 1 or greater, indicates to the neato layout engine that nodes have already been positioned (default is 0). With 1, performs adjustments to remove node-node overlaps. With 2 or greater, uses node positions and edge layouts as specified.

Returns an object with the result of rendering:

* `status: "success" | "failure"`: string indicating whether rendering succeeded or failed
* `output: string | undefined`: the rendered output, or undefined if nothing was rendered
* `errors: Array<{ level?: "error" | "warning", message: string }>`: an array of error message objects

## `viz.renderString(src[, options])`

Returns a string with the output of rendering. If rendering failed, or there was no output, throws an error. This accepts the same options as `viz.render`.

## `viz.renderSVGElement(src[, options])`

Convenience method that parses the output and returns an SVG element that can be inserted into the document. This accepts the same options as `viz.render`, except that the `format` option is always `"svg"`.

## `viz.renderJSON(src[, options])`

Convenience method that parses the output and returns a JSON object. This accepts the same options as `viz.render`, except that the `format` option is always `"json"`.
