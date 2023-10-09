# Viz.js

This is a collection of packages for working with <a href="https://graphviz.org">Graphviz</a> in JavaScript. The main package, [viz](./packages/viz), is a WebAssembly build of Graphviz with a simple JavaScript wrapper.

With Viz.js, you can easily render a graph diagram as an SVG element to display it in a webpage:

```js
import { instance } from "@viz-js/viz";

instance().then(viz => {
  document.body.appendChild(viz.renderSVGElement("digraph { a -> b }"))
});
```

Other packages:

- [lang-dot](./packages/lang-dot) — CodeMirror language support for the Graphviz DOT language.
- [website](./packages/website) — Try out Graphviz and Viz.js. Render a graph visualization in your browser.
- [examples/parcel](./packages/examples/parcel) — Example of using Viz.js with the Parcel bundler.
- [examples/script-tag](./packages/examples/script-tag) — Example of using the UMD build of Viz.js.

## Install

- Viz.js is published on NPM as [`@viz-js/viz`](https://www.npmjs.com/package/@viz-js/viz).
- lang-dot is published on NPM as [`@viz-js/lang-dot`](https://www.npmjs.com/package/@viz-js/lang-dot).

## API

[API Reference](https://viz-js.com/api/)
