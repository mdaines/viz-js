# Viz.js

This is a collection of packages for working with <a href="https://graphviz.org">Graphviz</a> in JavaScript. The main package, [viz](./packages/viz), is a WebAssembly build of Graphviz with a simple JavaScript wrapper.

With Viz.js, you can easily render a graph written in [Graphviz's DOT language](https://www.graphviz.org/doc/info/lang.html) and display it as an SVG element in a webpage:

```js
import { instance } from "@viz-js/viz";

instance().then(viz => {
  document.body.appendChild(viz.renderSVGElement("digraph { a -> b }"))
});
```

Other packages:

- [lang-dot](./packages/lang-dot) — CodeMirror mode for the DOT language.
- [website](./packages/website) — Try out Graphviz and Viz.js. Render a graph visualization in your browser.
- [examples/parcel](./packages/examples/parcel) — Example of using Viz.js with the Parcel bundler.
- [examples/script-tag](./packages/examples/script-tag) — Example of using the UMD build of Viz.js.

## Install

Viz.js is published on NPM as `@viz-js/viz`. You can also download it from the [releases page](https://github.com/mdaines/viz-js/releases).

## API

See [the wiki](https://github.com/mdaines/viz-js/wiki/API).
