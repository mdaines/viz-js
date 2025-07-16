Viz.js is a WebAssembly build of Graphviz with a simple JavaScript wrapper.

## Usage

Viz.js exports a function, {@link instance}, which encapsulates decoding the WebAssembly code and instantiating the WebAssembly and Emscripten modules. This returns a promise that resolves to an instance of the {@link Viz} class, which provides methods for {@link Viz.render | rendering graphs}.

```js
import * as Viz from "@viz-js/viz";

Viz.instance().then(viz => {
  const svg = viz.renderSVGElement("digraph { a -> b }");

  document.getElementById("graph").appendChild(svg);
});
```

The instance can be used to render multiple graphs.
