Viz.js is a WebAssembly build of Graphviz with a simple JavaScript wrapper.

## Usage

### ES module

```js
import { Viz } from "@viz-js/viz";

await Viz.load();

const svg = viz.renderSVGElement("digraph { a -> b }");
```

The instance can be used to render multiple graphs.

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
