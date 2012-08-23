  Module["ccall"]("vizRenderFromString", "number", ["string"], [src]);
  return Module["return"];
}

window["Viz"] = Viz;
