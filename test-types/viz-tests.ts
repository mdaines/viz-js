import Viz = require("viz.js");
import { Module, render } from "viz.js/full.js.opaque";

const vizTests = {
  "test: constructor and render functions": function() {
    let viz = new Viz();
    
    let stringResult: Promise<string> = viz.renderString("...");
    let svgElementResult: Promise<SVGSVGElement> = viz.renderSVGElement("...");
    let imageElementResult: Promise<HTMLImageElement> = viz.renderImageElement("...");
    let jsonObjectResult: Promise<any> = viz.renderJSONObject("...");
  },
  
  "test: constructor options": function() {
    let vizWorker = new Viz({ worker: "..." });
    let vizRender = new Viz({ Module, render });
    let vizInclude = new Viz();
  },

  "test: the render functions accept stringly-typed format and engine options": function() {
    let options: Viz.Options = { format: "...", engine: "..." };
  },

  "test: the render functions accept a yInvert option": function() {
    let options: Viz.Options = { yInvert: true };
  },

  "test: the render functions accept an images option": function() {
    let options: Viz.Options = {
      images: [
        { path: "http://example.com/image.png", width: "300px", height: "200px" },
        { path: "http://example.com/image2.png", width: 640, height: 480 },
      ]
    };
  },

  "test: the render functions accept a files option": function() {
    let options: Viz.Options = {
      files: [
        { path: "blah", data: "123" }
      ]
    };
  },

  "test: the image element render function accepts image options": function() {
    let options: Viz.ImageOptions = {
      scale: 2,
      mimeType: "image/jpeg",
      quality: 0.8
    };
  },
  
  "test: images and files are types": function() {
    let image: Viz.Image = { path: "test.png", width: 100, height: 100 };
    let file: Viz.File = { path: "blah", data: "123" };
  }
};
