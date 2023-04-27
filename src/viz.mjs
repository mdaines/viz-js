function render(module, src, options) {
  module.ccall("viz_init", "number", [], []);

  module.ccall("viz_set_yinvert", "number", ["number"], [options.yInvert ? 1 : 0]);
  module.ccall("viz_set_nop", "number", ["number"], [options.nop]);


  const srcLength = module.lengthBytesUTF8(src);

  const srcPointer = module.ccall("malloc", "number", ["number"], [srcLength + 1]);

  module.stringToUTF8(src, srcPointer, srcLength + 1);


  let result = [];
  let inputPointer = srcPointer;

  while (true) {
    module.ccall("viz_reset_errors", "number", [], []);
    module.errorMessages = [];

    const graphPointer = module.ccall("viz_read", "number", ["number"], [inputPointer]);

    if (graphPointer == 0) {
      if (module.ccall("viz_errors", "number", [], []) != 0) {
        result.push({
          status: "failure",
          errors: module.errorMessages.slice()
        });
      }

      break;
    }

    inputPointer = 0;

    const layoutResult = module.ccall("viz_layout", "number", ["number", "string"], [graphPointer, options.engine]);

    if (layoutResult != 0) {
      result.push({
        status: "failure",
        errors: module.errorMessages.slice()
      });

      module.ccall("viz_rm_graph", "number", ["number"], [graphPointer]);

      continue;
    }

    const resultPointer = module.ccall("viz_render", "number", ["number", "string"], [graphPointer, options.format]);

    if (resultPointer == 0) {
      result.push({
        status: "failure",
        errors: module.errorMessages.slice()
      });

      module.ccall("viz_rm_graph", "number", ["number"], [graphPointer]);

      continue;
    }

    const resultString = module.UTF8ToString(resultPointer);

    module.ccall("free", "number", ["number"], [resultPointer]);

    result.push({
      status: "success",
      output: resultString,
      errors: module.errorMessages.slice()
    });

    module.ccall("viz_rm_graph", "number", ["number"], [graphPointer]);
  }

  module.ccall("free", "number", ["number"], [srcPointer]);

  return result;
}

export default class Viz {
  constructor(module) {
    this.module = module;
  }

  render(src, options = {}) {
    return render(this.module, src, { format: "dot", engine: "dot", ...options });
  }

  renderString(src, options = {}) {
    const result = this.render(src, options);

    if (result.length == 0) {
      throw "No input";
    }

    if (result[0].status != "success") {
      throw `Error: ${result[0].errors.join("\n")}`;
    }

    return result[0].output;
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
