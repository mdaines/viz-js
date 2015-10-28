  function Viz(src) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var format = options.format === undefined ? "svg" : options.format;
    var engine = options.engine === undefined ? "dot" : options.engine;
  
    if (format == "png-image-element") {
      return Viz.svgXmlToPngImageElement(render(src, "svg", engine));
    } else {
      return render(src, format, engine);
    }
  }

  var graphviz;
  var errors;
  
  function appendError(buf) {
    errors += graphviz["Pointer_stringify"](buf);
  }
  
  function render(src, format, engine) {
    if (typeof graphviz === "undefined") {
      graphviz = Module();
    }
    
    errors = "";
    
    var resultPointer = graphviz["ccall"]("vizRenderFromString", "number", ["string", "string", "string"], [src, format, engine]);
    var resultString = graphviz["Pointer_stringify"](resultPointer);
    graphviz["_free"](resultPointer);
    
    if (errors != "") {
      throw errors;
    }
    
    return resultString;
  }
  
  Viz.svgXmlToPngImageElement = function(svgXml) {
    var scaleFactor = 1;
    
    if ("devicePixelRatio" in window) {
      if (window.devicePixelRatio > 1) {
        scaleFactor = window.devicePixelRatio;
      }
    }
    
    var svgImage = new Image();
    svgImage.src = "data:image/svg+xml;utf8," + svgXml;

    var pngImage = new Image();

    svgImage.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = svgImage.width * scaleFactor;
      canvas.height = svgImage.height * scaleFactor;

      var context = canvas.getContext("2d");
      context.drawImage(svgImage, 0, 0, canvas.width, canvas.height);

      pngImage.src = canvas.toDataURL("image/png");
      pngImage.width = svgImage.width;
      pngImage.height = svgImage.height;
    }
    
    return pngImage;
  }
  
  if (typeof module === "object" && module.exports) {
    module.exports = Viz;
  } else {
    global.Viz = Viz;
  }
  
})(this);
