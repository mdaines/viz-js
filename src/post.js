
  return function(src, format, engine) {
    format = format || "svg";
    engine = engine || "dot";

    return Module["ccall"]("vizRenderFromString", "string", ["string", "string", "string"], [src, format, engine]);
  }

})();
