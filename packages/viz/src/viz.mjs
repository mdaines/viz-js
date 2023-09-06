const errorPatterns = [
  [/^Error: (.*)/, "error"],
  [/^Warning: (.*)/, "warning"]
];

function parseStderrMessages(messages) {
  return messages.map(message => {
    for (let i = 0; i < errorPatterns.length; i++) {
      const [pattern, level] = errorPatterns[i];

      let match;

      if ((match = pattern.exec(message)) !== null) {
        return { message: match[1].trimEnd(), level };
      }
    }

    return { message: message.trimEnd() };
  });
}

function parseAgerrMessages(messages) {
  const result = [];
  let level = undefined;

  for (let i = 0; i < messages.length; i++) {
    if (messages[i] == "Error" && messages[i+1] == ": ") {
      level = "error";
      i += 1;
    } else if (messages[i] == "Warning" && messages[i+1] == ": ") {
      level = "warning";
      i += 1;
    } else {
      result.push({ message: messages[i].trimEnd(), level });
    }
  }

  return result;
}

function parseErrorMessages(module) {
  return parseAgerrMessages(module["agerrMessages"]).concat(parseStderrMessages(module["stderrMessages"]));
}

function withStringPointer(module, graphPointer, value, callbackFn) {
  let stringPointer;

  if (typeof value === "object" && "html" in value) {
    stringPointer = module.ccall("viz_string_dup_html", "number", ["number", "string"], [graphPointer, String(value.html)]);
  } else {
    stringPointer = module.ccall("viz_string_dup", "number", ["number", "string"], [graphPointer, String(value)]);
  }

  if (stringPointer == 0) {
    throw new Error("couldn't dup string");
  }

  callbackFn(stringPointer);

  module.ccall("viz_string_free", "number", ["number", "number"], [graphPointer, stringPointer]);
}

function setDefaultAttributes(module, graphPointer, data) {
  if (data.graphAttributes) {
    for (const [name, value] of Object.entries(data.graphAttributes)) {
      withStringPointer(module, graphPointer, value, stringPointer => {
        module.ccall("viz_set_default_graph_attribute", "number", ["number", "string", "number"], [graphPointer, name, stringPointer]);
      });
    }
  }

  if (data.nodeAttributes) {
    for (const [name, value] of Object.entries(data.nodeAttributes)) {
      withStringPointer(module, graphPointer, value, stringPointer => {
        module.ccall("viz_set_default_node_attribute", "number", ["number", "string", "number"], [graphPointer, name, stringPointer]);
      });
    }
  }

  if (data.edgeAttributes) {
    for (const [name, value] of Object.entries(data.edgeAttributes)) {
      withStringPointer(module, graphPointer, value, stringPointer => {
        module.ccall("viz_set_default_edge_attribute", "number", ["number", "string", "number"], [graphPointer, name, stringPointer]);
      });
    }
  }
}

function readStringInput(module, src, options) {
  let srcPointer;

  try {
    const srcLength = module.lengthBytesUTF8(src);
    srcPointer = module.ccall("malloc", "number", ["number"], [srcLength + 1]);
    module.stringToUTF8(src, srcPointer, srcLength + 1);

    return module.ccall("viz_read_one_graph", "number", ["number"], [srcPointer]);
  } finally {
    if (srcPointer) {
      module.ccall("free", "number", ["number"], [srcPointer]);
    }
  }
}

function setAttributes(module, graphPointer, objectPointer, attributes) {
  for (const [key, value] of Object.entries(attributes)) {
    withStringPointer(module, graphPointer, value, stringPointer => {
      module.ccall("viz_set_attribute", "number", ["number", "string", "number"], [objectPointer, key, stringPointer]);
    });
  }
}

function readGraph(module, graphPointer, graphData) {
  setDefaultAttributes(module, graphPointer, graphData);

  if (graphData.nodes) {
    graphData.nodes.forEach(nodeData => {
      const nodePointer = module.ccall("viz_add_node", "number", ["number", "string"], [graphPointer, String(nodeData.name)]);

      if (nodeData.attributes) {
        setAttributes(module, graphPointer, nodePointer, nodeData.attributes);
      }
    });
  }

  if (graphData.edges) {
    graphData.edges.forEach(edgeData => {
      const edgePointer = module.ccall("viz_add_edge", "number", ["number", "string", "string"], [graphPointer, String(edgeData.tail), String(edgeData.head)]);

      if (edgeData.attributes) {
        setAttributes(module, graphPointer, edgePointer, edgeData.attributes);
      }
    });
  }

  if (graphData.subgraphs) {
    graphData.subgraphs.forEach(subgraphData => {
      const subgraphPointer = module.ccall("viz_add_subgraph", "number", ["number", "string"], [graphPointer, String(subgraphData.name)]);

      readGraph(module, subgraphPointer, subgraphData);
    });
  }
}

function readObjectInput(module, object, options) {
  const graphPointer = module.ccall("viz_create_graph", "number", ["string", "number", "number"], [object.name, typeof object.directed !== "undefined" ? object.directed : true, typeof object.strict !== "undefined" ? object.strict : false]);

  readGraph(module, graphPointer, object);

  return graphPointer;
}

function renderInput(module, input, options) {
  let graphPointer, resultPointer;

  try {
    module["agerrMessages"] = [];
    module["stderrMessages"] = [];

    if (typeof input === "string") {
      graphPointer = readStringInput(module, input, options);
    } else if (typeof input === "object") {
      graphPointer = readObjectInput(module, input, options);
    } else {
      throw new Error("input must be a string or object");
    }

    if (graphPointer === 0) {
      return {
        status: "failure",
        output: undefined,
        errors: parseErrorMessages(module)
      };
    }

    setDefaultAttributes(module, graphPointer, options);

    module.ccall("viz_set_y_invert", "number", ["number"], [options.yInvert ? 1 : 0]);
    module.ccall("viz_set_reduce", "number", ["number"], [options.reduce ? 1 : 0]);

    resultPointer = module.ccall("viz_render_graph", "number", ["number", "string", "string"], [graphPointer, options.format, options.engine]);

    if (resultPointer === 0) {
      return {
        status: "failure",
        output: undefined,
        errors: parseErrorMessages(module)
      };
    }

    return {
      status: "success",
      output: module.UTF8ToString(resultPointer),
      errors: parseErrorMessages(module)
    };
  } catch (error) {
    if (/^exit\(\d+\)/.test(error)) {
      return {
        status: "failure",
        output: undefined,
        errors: parseErrorMessages(module)
      };
    } else {
      throw error;
    }
  } finally {
    if (graphPointer) {
      module.ccall("viz_free_graph", "number", ["number"], [graphPointer]);
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

  render(input, options = {}) {
    return renderInput(this.module, input, { format: "dot", engine: "dot", ...options });
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
