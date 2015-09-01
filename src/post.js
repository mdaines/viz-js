  var module;
  return function(src, options) {
    options = options || {};
    var format = options.format || "svg";
    var engine = options.engine || "dot";
    if (typeof module === "undefined") {
      module = Module();
    }
    return module["ccall"]("vizRenderFromString", "string", ["string", "string", "string"], [src, format, engine]);
  }
})();
