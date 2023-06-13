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

    const srcLength = module.lengthBytesUTF8(src);
    srcPointer = module.ccall("malloc", "number", ["number"], [srcLength + 1]);
    module.stringToUTF8(src, srcPointer, srcLength + 1);

    module.ccall("viz_set_y_invert", "number", ["number"], [options.yInvert ? 1 : 0]);

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

function getGraphvizVersion(module) {
  const resultPointer = module.ccall("viz_get_graphviz_version", "number", [], []);
  return module.UTF8ToString(resultPointer);
}

function getPluginList(module, kind) {
  const resultPointer = module.ccall("viz_get_plugin_list", "number", ["string"], [kind]);

  if (resultPointer == 0) {
    throw new Error(`couldn't get plugin list: ${kind}`);
  }

  const list = [];
  let itemPointer = resultPointer;
  let stringPointer;

  while (stringPointer = module.getValue(itemPointer, "*")) {
    list.push(module.UTF8ToString(stringPointer));
    module.ccall("free", "number", ["number"], [stringPointer]);
    itemPointer += 4;
  }

  module.ccall("free", "number", ["number"], [resultPointer]);

  return list;
}

export default class Viz {
  constructor(module) {
    this.module = module;
  }

  get graphvizVersion() {
    return getGraphvizVersion(this.module);
  }

  get formats() {
    return getPluginList(this.module, "device");
  }

  get engines() {
    return getPluginList(this.module, "layout");
  }

  render(src, options = {}) {
    if (typeof src !== "string") {
      throw new Error("src must be a string");
    }

    return render(this.module, src, { format: "dot", engine: "dot", ...options });
  }

  renderString(src, options = {}) {
    const result = this.render(src, options);

    if (result.status !== "success") {
      throw new Error(result.errors.find(e => e.level == "error")?.message || "render failed");
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
