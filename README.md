# Viz.js

[![Build Status](https://travis-ci.org/mdaines/viz.js.svg?branch=master)](https://travis-ci.org/mdaines/viz.js)

This project builds [Graphviz](http://www.graphviz.org) with [Emscripten](http://kripken.github.io/emscripten-site/) and provides a simple wrapper for using it in the browser.

For more information, [see the wiki](https://github.com/mdaines/viz.js/wiki).

## See Also

Have a look at [Dagre](https://dagrejs.github.io/), which is not a hack.

## Getting Viz.js

* Install the [`viz.js` package](https://www.npmjs.com/package/viz.js) from npm.
* Download from the [releases page](https://github.com/mdaines/viz.js/releases).

## Building From Source

To build from source, first [install the Emscripten SDK](http://kripken.github.io/emscripten-site/docs/getting_started/index.html). You'll also need [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com).

Install the development dependencies using Yarn:

    yarn install

The build process for Viz.js is split into two parts: building the Graphviz and Expat dependencies, and building the rendering script files and API.

    make deps
    make all

## Running Browser Tests

The browser tests can be run locally using Selenium WebDriver.

First, serve the project directory at http://localhost:8000.

    python -m SimpleHTTPServer
    
Then, run tests using test-browser/runner.js. For example, to run `test-browser/full.html` in Chrome:

    node test-browser/runner --file full.html --browser chrome
