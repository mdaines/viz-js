  var graphviz;
  
  return function(src) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var format = options.format === undefined ? "svg" : options.format;
    var engine = options.engine === undefined ? "dot" : options.engine;
    
    if (typeof graphviz === "undefined") {
      graphviz = Module();
    }
    
    return graphviz["ccall"]("vizRenderFromString", "string", ["string", "string", "string"], [src, format, engine]);
  }
})();

if (typeof module !== "undefined" && typeof module.exports !== 'undefined') {
  module.exports = Viz;
}
