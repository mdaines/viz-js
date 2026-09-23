# Viz.js

This is a collection of packages for working with <a href="https://graphviz.org">Graphviz</a> in JavaScript.

To render a graph as an SVG string:

```js
import { dot2svg } from "@viz-js/dot2svg";

const svg = await dot2svg("digraph { a -> b }");
```

Packages:

- [viz](./packages/viz) — WebAssembly build of Graphviz and JavaScript wrapper.
- [dot2svg](./packages/dot2svg) — Simplified interface for the `viz` package.
- [lang-dot](./packages/lang-dot) — CodeMirror language support for the Graphviz DOT language.

## Install

- viz is published on NPM as [`@viz-js/viz`](https://www.npmjs.com/package/@viz-js/viz).
- dot2svg is published on NPM as [`@viz-js/dot2svg`](https://www.npmjs.com/package/@viz-js/dot2svg).
- lang-dot is published on NPM as [`@viz-js/lang-dot`](https://www.npmjs.com/package/@viz-js/lang-dot).

## API

[API Reference](https://viz-js.com/api/)
