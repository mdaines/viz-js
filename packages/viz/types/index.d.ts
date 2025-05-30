export {}

/**
 * The version of Graphviz used for this build.
 */
export const graphvizVersion: string

/**
 * The names of the {@link https://www.graphviz.org/docs/outputs/ | Graphviz output formats} supported in this build.
 */
export const formats: string[]

/**
 * The names of the {@link https://www.graphviz.org/docs/layouts/ | Graphviz layout engines} supported in this build.
 */
export const engines: string[]

/**
 * Returns a promise that resolves to an instance of the {@link Viz} class.
 */
export function instance(): Promise<Viz>

/**
 * The {@link Viz} class isn't exported, but it can be instantiated using the {@link instance} function.
 */
declare class Viz {
  /**
   * The version of Graphviz at runtime.
   */
  get graphvizVersion(): string

  /**
   * The names of the {@link https://www.graphviz.org/docs/outputs/ | Graphviz output formats} supported at runtime.
   */
  get formats(): string[]

  /**
   * The names of the {@link https://www.graphviz.org/docs/layouts/ | Graphviz layout engines} supported at runtime.
   */
  get engines(): string[]

  /**
   * @internal
   */
  constructor()

  /**
   * Renders the graph described by the input and returns the result as an object.
   *
   * `input` may be a string in {@link https://www.graphviz.org/doc/info/lang.html | DOT syntax} or a {@link Graph | graph object}.
   *
   * This method does not throw an error if rendering failed, including for invalid DOT syntax, but it will throw for invalid types in input or unexpected runtime errors.
   */
  render(input: string | Graph, options?: RenderOptions): RenderResult

  /**
   * Renders the graph described by the input for each format in `formats` and returns the result as an object. For a successful result, `output` is an object keyed by format.
   */
  renderFormats(input: string | Graph, formats: string[], options?: RenderOptions): MultipleRenderResult

  /**
   * Renders the input and returns the result as a string. Throws an error if rendering failed.
   */
  renderString(input: string | Graph, options?: RenderOptions): string

  /**
   * Convenience method that renders the input, parses the output, and returns an SVG element. The `format` option is ignored. Throws an error if rendering failed.
   */
  renderSVGElement(input: string | Graph, options?: RenderOptions): SVGSVGElement

  /**
   * Convenience method that renders the input, parses the output, and returns a JSON object. The `format` option is ignored. Throws an error if rendering failed.
   */
  renderJSON(input: string | Graph, options?: RenderOptions): object
}

export { type Viz }

/**
 * @property format
 * The {@link https://www.graphviz.org/docs/outputs/ | Graphviz output format} to render. For example, `"dot"` or `"svg"`.
 *
 * @property engine
 * The {@link https://www.graphviz.org/docs/layouts/ | Graphviz layout engine} to use for graph layout. For example, `"dot"` or `"neato"`.
 *
 * @property yInvert
 * Invert y coordinates in output. This corresponds to the {@link https://www.graphviz.org/doc/info/command.html#-y | `-y`} Graphviz command-line option</a>.
 *
 * @property reduce
 * Reduce the graph. This corresponds to the {@link https://www.graphviz.org/doc/info/command.html#-x | `-x`} Graphviz command-line option</a>.
 *
 * @property graphAttributes
 * Sets the default graph attributes. This corresponds the {@link https://www.graphviz.org/doc/info/command.html#-G | `-G`} Graphviz command-line option</a>.
 *
 * @property nodeAttributes
 * Sets the default node attributes. This corresponds the {@link https://www.graphviz.org/doc/info/command.html#-N `-N`} Graphviz command-line option</a>.
 *
 * @property edgeAttributes
 * Sets the default edge attributes. This corresponds the {@link https://www.graphviz.org/doc/info/command.html#-E | `-E`} Graphviz command-line option</a>.
 *
 * @property images
 * Image sizes to use when rendering nodes with <code>image</code> attributes.
 *
 * For example, to indicate to Graphviz that the image <code>test.png</code> has size 300x200:
 *
 * ```js
 * viz.render("graph { a[image=\"test.png\"] }", {
 *   images: [
 *     { name: "test.png", width: 300, height: 200 }
 *   ]
 * });
 * ```
 */
export interface RenderOptions {
  format?: string
  engine?: string
  yInvert?: boolean
  reduce?: boolean
  graphAttributes?: Attributes
  nodeAttributes?: Attributes
  edgeAttributes?: Attributes
  images?: ImageSize[]
}

/**
 * The result object returned by {@link Viz.render}.
 */
export type RenderResult = SuccessResult | FailureResult

/**
 * Returned by {@link Viz.render} if rendering was successful. `errors` may contain warning messages even if the graph rendered successfully.
 */
export interface SuccessResult {
  status: "success"
  output: string
  errors: RenderError[]
}

/**
 * Returned by {@link Viz.render} or {@link Viz.renderFormats} if rendering failed.
 */
export interface FailureResult {
  status: "failure"
  output: undefined
  errors: RenderError[]
}

/**
 * The result object returned by {@link Viz.renderFormats}.
 */
export type MultipleRenderResult = MultipleSuccessResult | FailureResult

/**
 * Returned by {@link Viz.renderFormats} if rendering was successful. `errors` may contain warning messages even if the graph rendered successfully.
 */
export interface MultipleSuccessResult {
  status: "success"
  output: { [format: string]: string }
  errors: RenderError[]
}

export interface RenderError {
  level?: "error" | "warning"
  message: string
}

/**
 * In addition to strings in {@link https://www.graphviz.org/doc/info/lang.html | DOT syntax}, {@link Viz.render | rendering methods} accept <i>graph objects</i>.
 *
 * Graph objects are plain JavaScript objects, similar to {@link https://jsongraphformat.info | JSON Graph} or {@link https://github.com/dagrejs/graphlib/wiki/API-Reference#json-write | the Dagre JSON serialization}, but are specifically designed for working with Graphviz. Because of that, they use terminology from the Graphviz API (edges have a "head" and "tail", and nodes are identified with "name") and support features such as subgraphs, HTML labels, and default attributes.
 *
 * Some example graph objects and the corresponding graph in DOT:
 *
 * ## Empty directed graph
 *
 * ```json
 * {}
 * ```
 *
 * ```
 * digraph { }
 * ```
 *
 * ## Simple Undirected Graph
 *
 * ```json
 * {
 *   directed: false,
 *   edges: [
 *     { tail: "a", head: "b" },
 *     { tail: "b", head: "c" },
 *     { tail: "c", head: "a" }
 *   ]
 * }
 * ```
 *
 * ```
 * graph {
 *   a -- b
 *   b -- c
 *   c -- a
 * }
 * ```
 *
 * ## Attributes, Subgraphs, HTML Labels
 *
 * ```json
 * {
 *   graphAttributes: {
 *     rankdir: "LR"
 *   },
 *   nodeAttributes: {
 *     shape: "circle"
 *   },
 *   nodes: [
 *     { name: "a", attributes: { label: { html: "&lt;i&gt;A&lt;/i&gt;" }, color: "red" } },
 *     { name: "b", attributes: { label: { html: "&lt;b&gt;A&lt;/b&gt;" }, color: "green" } }
 *   ],
 *   edges: [
 *     { tail: "a", head: "b", attributes: { label: "1" } },
 *     { tail: "b", head: "c", attributes: { label: "2", headport: "name" } }
 *   ],
 *   subgraphs: [
 *     {
 *       name: "cluster_1",
 *       nodes: [
 *         {
 *           name: "c",
 *           attributes: {
 *             label: {
 *               html: "&lt;table&gt;&lt;tr&gt;&lt;td&gt;test&lt;/td&gt;&lt;td port=\"name\"&gt;C&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;"
 *             }
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 *
 * ```
 * digraph {
 *   graph [rankdir="LR"]
 *   node [shape="circle"]
 *   a [label=&lt;&lt;i&gt;A&lt;/i&gt;&gt;, color="red"]
 *   b [label=&lt;&lt;b&gt;B&lt;/b&gt;&gt;, color="green"]
 *   a -> b [label="1"]
 *   b -> c:name [label="2"]
 *   subgraph cluster_1 {
 *     c [label=&lt;&lt;table&gt;&lt;tr&gt;&lt;td port="name"&gt;C&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&gt;]
 *   }
 * }
 * ```
 */
export interface Graph {
  name?: string
  strict?: boolean
  directed?: boolean
  graphAttributes?: Attributes
  nodeAttributes?: Attributes
  edgeAttributes?: Attributes
  nodes?: Node[]
  edges?: Edge[]
  subgraphs?: Subgraph[]
}

export interface Attributes {
  [name: string]: string | number | boolean | HTMLString
}

export interface HTMLString {
  html: string
}

export interface Node {
  name: string
  attributes?: Attributes
}

export interface Edge {
  tail: string
  head: string
  attributes?: Attributes
}

export interface Subgraph {
  name?: string
  graphAttributes?: Attributes
  nodeAttributes?: Attributes
  edgeAttributes?: Attributes
  nodes?: Node[]
  edges?: Edge[]
  subgraphs?: Subgraph[]
}

/**
 * Specifies the size of an image used as a node's `image` attribute. See {@link RenderOptions.images}.
 *
 * `width` and `height` may be specified as numbers or strings with units: in, px, pc, pt, cm, or mm. If no units are given or measurements are given as numbers, points (pt) are used.
 *
 * @property name
 * The name of the image. In addition to filenames, names that look like absolute filesystem paths or URLs can be used. For example:
 *
 * - `"example.png"`
 * - `"/images/example.png"`
 * - `"http://example.com/image.png"`
 *
 * Names that look like relative filesystem paths, such as `"../example.png"`, are not supported.
 *
 * @property width
 * The width of the image.
 *
 * @property height
 * The height of the image.
 */
export interface ImageSize {
  name: string,
  width: string | number,
  height: string | number
}
