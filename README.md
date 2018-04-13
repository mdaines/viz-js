# Viz.js

[![Build Status](https://travis-ci.org/mdaines/viz.js.svg?branch=master)](https://travis-ci.org/mdaines/viz.js)

This project builds [Graphviz](http://www.graphviz.org) with [Emscripten](http://kripken.github.io/emscripten-site/) and provides a simple wrapper for using it in the browser.

## Getting Viz.js

To install with Yarn:

    yarn add viz.js

Or download from the [releases page](https://github.com/mdaines/viz.js/releases).

## Usage

Rendering a graph as an SVG element using a Web Worker:

    let viz = new Viz({ worker: 'path/to/full.module' );
    
    viz.renderSVGElement('digraph { a -> b; }')
    .then(element => {
      document.body.appendChild(element);
    });

The input to `renderSVGElement` is a graph in the [DOT language](http://www.graphviz.org/content/dot-language).

For more information, see the [API documentation](https://github.com/mdaines/viz.js/wiki/API).

## Building Viz.js

To build from source, you will need to [install the Emscripten SDK](http://kripken.github.io/emscripten-site/docs/getting_started/index.html).

Then, install the development dependencies using Yarn:

    yarn install

The build process for Viz.js is split into two parts: building the Graphviz and Expat dependencies, and building the "modules" and the main `viz.js` script.

    make deps
    make all

## Running Browser Tests

The browser tests can be run locally using Selenium WebDriver.

First, serve the project directory at http://localhost:8000. For example:

    python -m SimpleHTTPServer
    
Then, run tests using test-browser/runner.js. For example, to run `test-browser/full.html` in Chrome:

    node test-browser/runner --file full.html --browser chrome
