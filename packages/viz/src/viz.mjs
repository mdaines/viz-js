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

/**
 * An object representing a graph.
 * @example
 * {
 *   edges: [
 *     { tail: "a", head: "b" }
 *   ]
 * }
 * @example
 * {
 *   directed: false,
 *   nodeAttributes: { style: "filled", fontcolor: "white" },
 *   edges: [
 *     { tail: "a", head: "b", attributes: { label: "1" } },
 *     { tail: "b", head: "c", attributes: { label: "2" } },
 *     { tail: "c", head: "a", attributes: { label: "3" } }
 *   ],
 *   nodes: [
 *     { name: "a", attributes: { color: "red" } },
 *     { name: "b", attributes: { color: "green" } },
 *     { name: "c", attributes: { color: "blue" } }
 *   ]
 * }
 * @typedef {object} Graph
 * @property {string} [name]
 * @property {boolean} [strict=false]
 * @property {boolean} [directed=true]
 * @property {Attributes} [graphAttributes]
 * @property {Attributes} [nodeAttributes]
 * @property {Attributes} [edgeAttributes]
 * @property {Node[]} [nodes]
 * @property {Edge[]} [edges]
 * @property {Subgraph[]} [subgraphs]
 */

/**
 * An object representing the attributes for a graph, node, or edge.
 * Used to specify attributes in {@link Graph}, {@link Node}, {@link Edge}, or {@link Subgraph}, and default attributes in {@link RenderOptions}.
 * @example
 * {
 *   color: "blue",
 *   width: 1,
 *   label: { html: "<i>Viz.js</i>" }
 * }
 * @typedef {Object.<string, AttributeValue>} Attributes
 */

/**
 * Values that can be specified for {@link Attributes}.
 * @typedef {string | number | boolean | HTMLString} AttributeValue
 */

/**
 * An HTML string attribute value.
 * This can be used to create <a href="https://www.graphviz.org/doc/info/shapes.html#html">HTML-like labels</a>.
 * @example
 * { html: "<i>Hello!</i>" }
 * @typedef {object} HTMLString
 * @property {string} html
 */

/**
 * An object representing a node in a {@link Graph}.
 * @typedef {object} Node
 * @property {string} name
 * @property {Attributes} [attributes]
 */

/**
 * An object representing a edge in a {@link Graph}.
 * @typedef {object} Edge
 * @property {string} tail
 * @property {string} head
 * @property {Attributes} [attributes]
 */

/**
 * An object representing a subgraph in a {@link Graph}.
 * @typedef {object} Subgraph
 * @property {string} [name]
 * @property {Attributes} [graphAttributes]
 * @property {Attributes} [nodeAttributes]
 * @property {Attributes} [edgeAttributes]
 * @property {Node[]} [nodes]
 * @property {Edge[]} [edges]
 * @property {Subgraph[]} [subgraphs]
 */

/**
 * Options for {@link Viz#render} and other render methods.
 * @typedef {object} RenderOptions
 * @property {string} [format=dot]
 * @property {string} [engine=dot]
 * @property {boolean} [yInvert=false]
 * @property {boolean} [reduce=false]
 * @property {Attributes} [graphAttributes]
 * @property {Attributes} [nodeAttributes]
 * @property {Attributes} [edgeAttributes]
 */

/**
 * An object representing the result of rendering. See {@link Viz#render}.
 * @typedef {SuccessResult | FailureResult} RenderResult
 */

/**
 * Returned by {@link Viz#render} when rendering is successful.
 * @typedef {object} SuccessResult
 * @property {"success"} status
 * @property {string} output
 * @property {RenderError[]} errors
 */

/**
 * Returned by {@link Viz#render} when rendering is unsuccessful.
 * @typedef {object} FailureResult
 * @property {"failure"} status
 * @property {undefined} output
 * @property {RenderError[]} errors
 */

/**
 * A warning or error message emitted by Graphviz during rendering.
 * @typedef {object} RenderError
 * @property {"error" | "warning"} [level]
 * @property {string} message
 */

/**
 * Wraps an instance of the Emscripten module used to call Graphviz.
 * Use {@link module:viz.instance} to create a new instance of this class.
 */
class Viz {
  /** @package */
  constructor(module) {
    this.module = module;
  }

  /**
   * Returns a string indicating the version of Graphviz available at runtime.
   * The constant{@link module:viz.graphvizVersion} records the value of this method at build time.
   * @returns {string}
   */
  get graphvizVersion() {
    return getGraphvizVersion(this.module);
  }

  /**
   * Returns an array of strings indicating the supported Graphviz output formats at runtime.
   * The constant {@link module:viz.formats} records the value of this method at build time.
   * @returns {string[]}
   */
  get formats() {
    return getPluginList(this.module, "device");
  }

  /**
   * Returns an array of strings indicating the supported Graphviz layout engines at runtime.
   * The constant {@link module:viz.engines} records the value of this method at build time.
   * @returns {string[]}
   */
  get engines() {
    return getPluginList(this.module, "layout");
  }

 /**
  * Renders the graph described by the input and returns an object representing the result of rendering.
  * @param {string | Graph} input
  * @param {RenderOptions} [options]
  * @returns {RenderResult}
  */
  render(input, options = {}) {
    return renderInput(this.module, input, { format: "dot", engine: "dot", ...options });
  }

  /**
   * Renders the input and returns the result as a string.
   * This method accepts the same options as {@link Viz#render}.
   * @param {string | Graph} input
   * @param {RenderOptions} [options]
   * @returns {string}
   * @throws Throws an error if rendering failed.
   */
  renderString(src, options = {}) {
    const result = this.render(src, options);

    if (result.status !== "success") {
      throw new Error(result.errors.find(e => e.level == "error")?.message || "render failed");
    }

    return result.output;
  }

  /**
   * Convenience method that parses the output and returns an SVG element that can be inserted into the document.
   * This method accepts the same options as {@link Viz#render}, except the format option is always "svg".
   * @param {string | Graph} input
   * @param {RenderOptions} [options]
   * @returns {SVGSVGElement}
   * @throws Throws an error if rendering failed.
   */
  renderSVGElement(src, options = {}) {
    const str = this.renderString(src, { ...options, format: "svg" });
    const parser = new DOMParser();
    return parser.parseFromString(str, "image/svg+xml").documentElement;
  }

  /**
   * Convenience method that renders the input, parses the output, and returns a JSON object.
   * If rendering failed, it throws an error.
   * This method accepts the same options as {@link Viz#render}, except that the format option is always "json".
   * @param {string | Graph} input
   * @param {RenderOptions} [options]
   * @returns {object}
   * @throws Throws an error if rendering failed.
   */
  renderJSON(src, options = {}) {
    const str = this.renderString(src, { ...options, format: "json" });
    return JSON.parse(str);
  }
}

export default Viz;
