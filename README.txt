Viz.js
======

Simple Graphviz for the web, compiled with Emscripten.

To render as SVG (produces an XML string):

  svg = Viz("digraph { a -> b; }", "svg");

Viz.js supports Graphviz's other layout engines (neato, etc.) via the layout graph attribute. For example:

  svg = Viz("graph { graph[layout=neato]; a -- b; b -- c; }", "svg");

This project is based on work by Satoshi Ueyama and Brenton Partridge:

  https://github.com/gyuque/livizjs
  https://github.com/bpartridge/graphviz.js

Thanks to the following contributors:

  KylePDavis
  srathbun
  jbogard
  siefkenj
