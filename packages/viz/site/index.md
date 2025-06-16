Viz.js is a WebAssembly build of Graphviz with a simple JavaScript wrapper.

## Usage

### ES module

```js
import { Viz } from "@viz-js/viz";

if (!Viz.isLoaded) {
  await Viz.load();
}

const svg = Viz.renderSVGElement("digraph { a -> b }");
```

### UMD Bundle

The package also includes a UMD bundle, <code>lib/viz-standalone.js</code> which assigns a global `Viz` object.

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
