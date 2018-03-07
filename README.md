# Viz.js

[![Build Status](https://travis-ci.org/mdaines/viz.js.svg?branch=master)](https://travis-ci.org/mdaines/viz.js)

This project builds [Graphviz](http://www.graphviz.org) with [Emscripten](http://kripken.github.io/emscripten-site/) and provides a simple wrapper for using it in the browser.

## Getting Viz.js

Install with Bower:

    bower install viz.js

Or with npm:

    npm install viz.js

Or get it from the [releases page](https://github.com/mdaines/viz.js/releases).

### "Lite" Version

A smaller version of Viz.js is available on the [releases page](https://github.com/mdaines/viz.js/releases) and the Bower package. `viz-lite.js` omits Expat and the NEATO layout plugin.

## Usage

Rendering a graph as SVG:

    var svg = Viz("digraph { a -> b; }");

The input to `Viz()` is a graph in the [DOT language](http://www.graphviz.org/content/dot-language). The output `svg` is an SVG XML string.

For more information, see the [API documentation](https://github.com/mdaines/viz.js/wiki/API).

## Building Viz.js

To build from source, you will need to [install the Emscripten SDK](http://kripken.github.io/emscripten-site/docs/getting_started/index.html).

To download the sources and build everything:

    make
