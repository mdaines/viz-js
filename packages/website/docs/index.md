Viz.js is a WebAssembly build of Graphviz with a simple JavaScript wrapper.

## Usage

### ES module

<p>The Viz.js ES module is published as a single file, including its WebAssembly code. It exports a function, {@link instance}, which encapsulates decoding the WebAssembly code and instantiating the WebAssembly and Emscripten modules. This returns a promise that resolves to an instance of the {@link Viz} class, which provides methods for {@link Viz.render | rendering graphs}.</p>

```js
import { instance } from "@viz-js/viz";

instance().then(viz => {
  const svg = viz.renderSVGElement("digraph { a -> b }");

  document.getElementById("graph").appendChild(svg);
});
```

The instance can be used to render multiple graphs.</p>

### UMD Bundle

The package also includes a UMD bundle, <code>lib/viz-standalone.js</code>. This assigns the {@link instance} function to a global <code>Viz</code> object.

```html
<div id="graph"></div>

<script src="viz-standalone.js"></script>
<script>
  Viz.instance().then(function(viz) {
    var svg = viz.renderSVGElement("digraph { a -> b }");

    document.getElementById("graph").appendChild(svg);
  });
</script>
```
