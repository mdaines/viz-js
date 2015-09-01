
  return function(src, options) {
    options = options || {};
    var format = options.format || "svg";
    var engine = options.engine || "dot";

    return Module["ccall"]("vizRenderFromString", "string", ["string", "string", "string"], [src, format, engine]);
  }

})();
