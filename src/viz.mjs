function parseErrorMessages(messages) {
  return messages.map(message => ({ message }));
}

function render(module, src, options) {
  module.errorMessages = [];

  module.ccall("viz_init", "number", [], []);
  module.ccall("viz_reset_errors", "number", [], []);

  module.ccall("viz_set_yinvert", "number", ["number"], [options.yInvert ? 1 : 0]);
  module.ccall("viz_set_nop", "number", ["number"], [options.nop]);

  const srcLength = module.lengthBytesUTF8(src);
  const srcPointer = module.ccall("malloc", "number", ["number"], [srcLength + 1]);
  module.stringToUTF8(src, srcPointer, srcLength + 1);

  let graphPointer;

  try {
    graphPointer = module.ccall("viz_read", "number", ["number"], [srcPointer]);

    if (graphPointer == 0) {
      if (module.ccall("viz_errors", "number", [], []) != 0) {
        return {
          status: "failure",
          output: undefined,
          errors: parseErrorMessages(module.errorMessages)
        };
      } else {
        return {
          status: "success",
          output: undefined,
          errors: parseErrorMessages(module.errorMessages)
        }
      }
    }

    const layoutResult = module.ccall("viz_layout", "number", ["number", "string"], [graphPointer, options.engine]);

    if (layoutResult != 0) {
      return {
        status: "failure",
        output: undefined,
        errors: parseErrorMessages(module.errorMessages)
      };
    }

    const resultPointer = module.ccall("viz_render", "number", ["number", "string"], [graphPointer, options.format]);

    if (resultPointer == 0) {
      return {
        status: "failure",
        output: undefined,
        errors: parseErrorMessages(module.errorMessages)
      };
    }

    const resultString = module.UTF8ToString(resultPointer);
    module.ccall("free", "number", ["number"], [resultPointer]);

    return {
      status: "success",
      output: resultString,
      errors: parseErrorMessages(module.errorMessages)
    };
  } finally {
    let ignoredGraphPointer;
    do {
      ignoredGraphPointer = module.ccall("viz_read", "number", ["number"], [0]);
    } while (ignoredGraphPointer != 0);

    if (graphPointer) {
      module.ccall("viz_rm_graph", "number", ["number"], [graphPointer]);
    }

    if (srcPointer) {
      module.ccall("free", "number", ["number"], [srcPointer]);
    }
  }
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

    if (result.status != "success") {
      throw new Error(`Error: ${result.errors.join("\n")}`);
    }

    if (typeof result.output != "string") {
      throw new Error("No output");
    }

    return result.output;
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
