viz.js
======
Simple Graphviz for the web, compiled with Emscripten.


API
---
```javascript
  var output = viz(src, format);
```

arguments:

  * `src` - the GraphViz source text
    * NOTE: you can give a `layout` graph attribute use any of the following layout engines:
      - dot (default)
      - circo
      - fdp
      - neato
      - nop
      - nop1
      - nop2
      - osage
      - patchwork
      - twopi
  * `format` - the output format, which can be one of:
    - dot
    - svg
    - ps


Example
-------
To render a simple graph as SVG XML string you might do:
```javascript
  var svg = viz("digraph { graph[layout=dot]; a -> b; }", "svg");
```


Acknowledgements
----------------
This project is based on work by Satoshi Ueyama and Brenton Partridge:

  * https://github.com/gyuque/livizjs
  * https://github.com/bpartridge/graphviz.js
