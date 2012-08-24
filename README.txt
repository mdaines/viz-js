Viz.js
======

Simple Graphviz for the web, compiled with Emscripten.

To render as SVG (produces an XML string):

  svg = Viz("digraph { a -> b; }", "svg");

This project is based on work by Satoshi Ueyama and Brenton Partridge:

  https://github.com/gyuque/livizjs
  https://github.com/bpartridge/graphviz.js
