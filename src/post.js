  var module = Module();
  return function(src, options) {
    options = options || {};
    var format = options.format || "svg";
    var engine = options.engine || "dot";
    return module["ccall"]("vizRenderFromString", "string", ["string", "string", "string"], [src, format, engine]);
  }
})();
