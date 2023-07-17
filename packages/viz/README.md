# Viz.js

This project builds [Graphviz](http://www.graphviz.org) with [Emscripten](https://emscripten.org) and provides a simple wrapper for using it on the web.

## Install

Viz.js is published on NPM as `@viz-js/viz`. You can also download it from the [releases page](https://github.com/mdaines/viz-js/releases).

## Usage

Call `instance()`, which returns a `Promise` that resolves to a new `Viz` instance. Then call any of the instance's `render` methods to render a graph written in [the DOT language](https://www.graphviz.org/doc/info/lang.html). The `renderSVGElement()` method is convenient for displaying a graph in a webpage. The instance can be reused for multiple `render` calls.

```js
<script type="module">
  
  import { instance } from "@viz-js/viz";

  instance().then(function(viz) {
    document.body.appendChild(viz.renderSVGElement("digraph { a -> b }"));
  });

</script>
```

```js
<script src="viz-standalone.js"></script>
<script>

  Viz.instance().then(function(viz) {
    document.body.appendChild(viz.renderSVGElement("digraph { a -> b }"));
  });

</script>
```

See the examples directory for more.

## API

See [the wiki](https://github.com/mdaines/viz-js/wiki/API).

## Build

Make, Docker, and Yarn are prerequisites. Install the JavaScript dependencies with `yarn install` and then run `make` to build everything.
