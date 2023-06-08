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
  let srcPointer, resultPointer;

  try {
    module.errorMessages = [];

    module.ccall("viz_set_yinvert", "number", ["number"], [options.yInvert ? 1 : 0]);
    module.ccall("viz_set_nop", "number", ["number"], [options.nop]);

    const srcLength = module.lengthBytesUTF8(src);
    srcPointer = module.ccall("malloc", "number", ["number"], [srcLength + 1]);
    module.stringToUTF8(src, srcPointer, srcLength + 1);

    resultPointer = module.ccall("viz_render_string", "number", ["number", "string", "string"], [srcPointer, options.format, options.engine]);

    if (resultPointer === 0) {
      return {
        status: "failure",
        output: undefined,
        errors: parseErrorMessages(module.errorMessages)
      };
    }

    return {
      status: "success",
      output: module.UTF8ToString(resultPointer),
      errors: parseErrorMessages(module.errorMessages)
    };
  } finally {
    if (srcPointer) {
      module.ccall("free", "number", ["number"], [srcPointer]);
    }

    if (resultPointer) {
      module.ccall("free", "number", ["number"], [resultPointer]);
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

    if (result.status !== "success") {
      throw new Error(`Error: ${result.errors.map(e => e.message).join("\n")}`);
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
