  var graphviz;
  var errors;
  
  function appendError(buf) {
    errors += graphviz["Pointer_stringify"](buf);
  }
  
  function Viz(src) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var format = options.format === undefined ? "svg" : options.format;
    var engine = options.engine === undefined ? "dot" : options.engine;
    
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
  
  if (typeof module === "object" && module.exports) {
    module.exports = Viz;
  } else {
    global.Viz = Viz;
  }
  
})(this);
