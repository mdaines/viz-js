function render(module, src, options) {
  module.ccall("vizSetY_invert", "number", ["number"], [options.yInvert ? 1 : 0]);
  module.ccall("vizSetNop", "number", ["number"], [options.nop ? 1 : 0]);

  const resultPointer = module.ccall("vizRenderFromString", "number", ["string", "string", "string"], [src, options.format, options.engine]);
  const resultString = module.UTF8ToString(resultPointer);
  module.ccall("free", "number", ["number"], [resultPointer]);

  return resultString;
}

export class Viz {
  constructor(module) {
    this.module = module;
  }

  renderString(src, options = {}) {
    return render(this.module, src, { format: "dot", engine: "dot", ...options });
  }

  renderSVGElement(src, options = {}) {
    const str = this.renderString(src, { ...options, format: "svg" });
    const parser = new DOMParser();
    return parser.parseFromString(str, "image/svg+xml").documentElement;
  }

  renderJSON(src, options = {}) {
    const str = this.renderString(src, { ...options, format: "json" });
    return JSON.parse(str);
  }
}
