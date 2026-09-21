export {}

/**
 * Renders the graph described by the input as SVG. Returns a promise that is either fulfilled with result as a string, or rejected if rendering failed.
 *
 * ```js
 * const svg = await dot2svg("digraph { a -> b }");
 * ```
 *
 * @param src - The input in {@link https://www.graphviz.org/doc/info/lang.html | DOT syntax}.
 */
export function dot2svg(src: string, options?: Options): Promise<string>

/**
 * @property layout
 * The {@link https://www.graphviz.org/docs/layouts/ | Graphviz layout engine} to use for graph layout. For example, `"dot"` or `"neato"`.
 *
 * @property graphAttributes
 * Sets the default graph attributes. This corresponds the {@link https://www.graphviz.org/doc/info/command.html#-G | `-G`} Graphviz command-line option.
 *
 * For example, to override the default font color and label of the graph:
 *
 * ```js
 * dot2svg("digraph { a -> b }", {
 *   graphAttributes: {
 *     fontcolor: "blue",
 *     label: "My Graph"
 *   }
 * });
 * ```
 *
 * @property nodeAttributes
 * Sets the default node attributes. This corresponds the {@link https://www.graphviz.org/doc/info/command.html#-N `-N`} Graphviz command-line option.
 *
 * @property edgeAttributes
 * Sets the default edge attributes. This corresponds the {@link https://www.graphviz.org/doc/info/command.html#-E | `-E`} Graphviz command-line option.
 *
 * @property images
 * Image sizes to use when rendering nodes with <code>image</code> attributes.
 *
 * For example, to indicate to Graphviz that the image <code>test.png</code> has size 300x200:
 *
 * ```js
 * dot2svg("graph { a[image=\"test.png\"] }", {
 *   images: [
 *     { name: "test.png", width: 300, height: 200 }
 *   ]
 * });
 * ```
 *
 * @property reduce
 * When using the "neato" layout engine, prune isolated nodes and peninsulas from the input graph. This corresponds to the {@link https://www.graphviz.org/doc/info/command.html#-x | `-x`} Graphviz command-line option.
 */
export interface Options {
  layout?: string
  graphAttributes?: Attributes
  nodeAttributes?: Attributes
  edgeAttributes?: Attributes
  images?: ImageSize[]
  reduce?: boolean
}

/**
 * Specifies attributes for the graph, or default {@link https://www.graphviz.org/doc/info/attrs.html | attributes} for nodes or edges. Used by the {@link Options.graphAttributes}, {@link Options.nodeAttributes}, and {@link Options.edgeAttributes} options.
 *
 * For example:
 *
 * ```js
 * {
 *   color: "blue",
 *   fontsize: 18
 * }
 * ```
 */
export interface Attributes {
  [name: string]: string | number | boolean | HTMLString
}

/**
 * Indicates that an attribute value is an HTML string.
 *
 * The {@link HTMLString.html} property specifies the HTML.
 *
 * This is used when setting an object's label to an {@link https://www.graphviz.org/doc/info/shapes.html#html | HTML-like label}.
 *
 * For example:
 *
 * ```js
 * {
 *   graphAttributes: {
 *     label: { html: "<b>My Graph</b>" }
 *   }
 * }
 * ```
 */
export interface HTMLString {
  html: string
}

/**
 * Specifies the size of an image used as a node's `image` attribute. See {@link Options.images}.
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
