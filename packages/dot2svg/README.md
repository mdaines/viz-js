# dot2svg

A simple way to render graph diagrams as SVG using Graphviz.

```js
import { dot2svg } from "@viz-js/dot2svg";

const svg = await dot2svg("digraph { a -> b }");

// parse, insert into your HTML document, etc.
```
