const vizTests = {
  "test: the return value of the main function is a string": function() {
    let result: string = Viz("...");
  },

  "test: the main function accepts format and engine options": function() {
    let result: string = Viz("...", { format: "xdot", engine: "neato" });
  },
  
  "test: the return value of the main function is an HTMLImageElement when format is png-image-element": function() {
    let result: HTMLImageElement = Viz("...", { format: "png-image-element" });
  },
  
  "test: the engine option is stringly typed": function() {
    let result: string = Viz("...", { engine: "..." });
  },

  "test: the main function accepts a scale option": function() {
    let result: string = Viz("...", { scale: 2 });
  },

  "test: the main function accepts an images option": function() {
    let result: string = Viz("...", {
      images: [
        { href: "http://example.com/image.png", width: "300px", height: "200px" },
        { href: "http://example.com/image2.png", width: 640, height: 480 },
      ]
    });
  },

  "test: the main function accepts a files option": function() {
    let result: string = Viz("...", {
      files: [
        { path: "blah", data: "123" }
      ]
    });
  },

  "test: the main function accepts a totalMemory option": function() {
    let result: string = Viz("...", { totalMemory: 1024 });
  },
  
  "test: the svgXmlToPngImageElement helper accepts an optional scale and returns an HTMLImageElement if there is no callback": function() {
    let result: HTMLImageElement = Viz.svgXmlToPngImageElement("...", 2);
    let result2: HTMLImageElement = Viz.svgXmlToPngImageElement("...");
  },
  
  "test: the svgXmlToPngImageElement helper accepts a callback and an optional scale": function() {
    Viz.svgXmlToPngImageElement("...", 2, function(err, data) {
      if (err) {
        let message = err.message;
      }
      
      if (data) {
        let element: HTMLImageElement = data;
      }
    });
    

    Viz.svgXmlToPngImageElement("...", undefined, function(err, data) {
      if (err) {
        let message = err.message;
      }
      
      if (data) {
        let element: HTMLImageElement = data;
      }
    });
  },
  
  "test: the svgXmlToPngBase64 helper accepts a callback and an optional scale": function() {
    Viz.svgXmlToPngBase64("...", 2, function(err, data) {
      if (err) {
        let message = err.message;
      }
      
      if (data) {
        let str: string = data;
      }
    });
    

    Viz.svgXmlToPngBase64("...", undefined, function(err, data) {
      if (err) {
        let message = err.message;
      }
      
      if (data) {
        let str: string = data;
      }
    });
  }
}
