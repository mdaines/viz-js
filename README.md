Viz.js
======

Simple [Graphviz](http://www.graphviz.org/) for the web, compiled with [Emscripten](http://emscripten.org).

To render as SVG (produces an XML string):

    svg = Viz("digraph { a -> b; }", "svg");

See a live example [here](http://mdaines.github.com/viz.js/example.html).
  
This project is based on existing work by:

* Satoshi Ueyama - [liviz.js](https://github.com/gyuque/livizjs)
* Brenton Partridge - [graphviz.js](https://github.com/bpartridge/graphviz.js)