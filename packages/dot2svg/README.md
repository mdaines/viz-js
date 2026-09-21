# dot2svg

A simple library for rendering graph diagrams as SVG using Graphviz.

It exports a single function which accepts the description of a graph in DOT syntax, and returns a promise which fulfills with the rendered SVG as a string.

```js
import { dot2svg } from "@viz-js/dot2svg";

const svg = await dot2svg("digraph { a -> b }");

// parse, insert into your HTML document, etc.
```

## Options

The `dot2svg` function accepts the following options:

- <code>**layout**: string</code>

  The [Graphviz layout engine](https://www.graphviz.org/docs/layouts/) to use for graph layout. For example, `"dot"` or `"neato"`. The default layout engine is `"dot"`.
  
- <code>**graphAttributes**: object</code>

  An object specifying the default graph attributes. This corresponds the [`-G` Graphviz command-line option](https://www.graphviz.org/doc/info/command.html#-G).

- <code>**nodeAttributes**: object</code>

  An object specifying the default node attributes. This corresponds the [`-N` Graphviz command-line option](https://www.graphviz.org/doc/info/command.html#-N).

- <code>**edgeAttributes**: object</code>

  An object specifying the default edge attributes. This corresponds the [`-E` Graphviz command-line option](https://www.graphviz.org/doc/info/command.html#-E).

- <code>**images**: [object]</code>

  Image sizes to use when rendering nodes with <code>image</code> attributes.

- <code>**reduce**: boolean</code>

  When using the "neato" layout engine, prune isolated nodes and peninsulas from the input graph. This corresponds to the [`-x` Graphviz command-line option](https://www.graphviz.org/doc/info/command.html#-x).

### Image sizes

To indicate to Graphviz that the image <code>test.png</code> has size 300x200:

```js
dot2svg("graph { a[image=\"test.png\"] }", {
  images: [
    { name: "test.png", width: 300, height: 200 }
  ]
});
```

### HTML strings

Attribute values can be specified as *HTML strings*. For example, to set an object's label to an [HTML-like label](https://www.graphviz.org/doc/info/shapes.html#html):

```js
dot2svg("digraph { a -> b }", {
  graphAttributes: {
    label: { html: "<b>My Graph</b>" }
  }
});
```
