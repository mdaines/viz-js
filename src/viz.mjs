const errorPatterns = [
  [/^Error: (.*)/, "error"],
  [/^Warning: (.*)/, "warning"]
];

function parseErrorMessages(messages) {
  return messages.map(message => {
    for (let i = 0; i < errorPatterns.length; i++) {
      const [pattern, level] = errorPatterns[i];

      let match;

      if ((match = pattern.exec(message)) !== null) {
        return { message: match[1], level };
      }
    }

    return { message };
  });
}

function render(module, src, options) {
  module.errorMessages = [];

  module.ccall("viz_set_yinvert", "number", ["number"], [options.yInvert ? 1 : 0]);
  module.ccall("viz_set_nop", "number", ["number"], [options.nop]);

  const srcLength = module.lengthBytesUTF8(src);
  const srcPointer = module.ccall("malloc", "number", ["number"], [srcLength + 1]);
  module.stringToUTF8(src, srcPointer, srcLength + 1);

  const resultPointer = module.ccall("viz_render_string", "number", ["number", "string", "string"], [srcPointer, options.format, options.engine]);
  const resultString = module.UTF8ToString(resultPointer);

  module.ccall("free", "number", ["number"], [srcPointer]);

  if (resultPointer == 0) {
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
      };
    }
  }

  module.ccall("free", "number", ["number"], [resultPointer]);

  return {
    status: "success",
    output: resultString,
    errors: parseErrorMessages(module.errorMessages)
  };
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
      throw new Error(`Error: ${result.errors.map(e => e.message).join("\n")}`);
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
