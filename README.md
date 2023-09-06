# Viz.js

This is a collection of packages for working with <a href="https://graphviz.org">Graphviz</a> in JavaScript. The main package, [viz](./packages/viz), is a WebAssembly build of Graphviz with a simple JavaScript wrapper.

With Viz.js, you can easily render a graph written in [Graphviz's DOT language](https://www.graphviz.org/doc/info/lang.html) and display it as an SVG element in a webpage:

```js
import { instance } from "@viz-js/viz";

instance().then(viz => {
  document.body.appendChild(viz.renderSVGElement("digraph { a -> b }"))
});
```

You may add images as well:
```js
Viz.instance().then(function(viz) {
  document.body.appendChild(viz.renderSVGElement(`digraph {

    a -> b

    a [label=<<table>
      <tr><td>Image:</td></tr>
      <tr><td><img src="https://picsum.photos/id/184/100/100"/></td></tr>
    </table>>]

    b [image="https://picsum.photos/id/250/200/100"]

  }`, {images: [
    {path: 'https://picsum.photos/id/184/100/100', width: 100, height: 100},
    {path: 'https://picsum.photos/id/250/200/100', width: 200, height: 100},
  ]}));
})
```

Other packages:

- [lang-dot](./packages/lang-dot) — CodeMirror language support for the Graphviz DOT language.
- [website](./packages/website) — Try out Graphviz and Viz.js. Render a graph visualization in your browser.
- [examples/parcel](./packages/examples/parcel) — Example of using Viz.js with the Parcel bundler.
- [examples/script-tag](./packages/examples/script-tag) — Example of using the UMD build of Viz.js.

## Install

- Viz.js is published on NPM as [`@viz-js/viz`](https://www.npmjs.com/package/@viz-js/viz).

## API

See [the wiki](https://github.com/mdaines/viz-js/wiki/API).
