# Viz.js

This project builds [Graphviz](http://www.graphviz.org) with [Emscripten](https://emscripten.org) and provides a simple wrapper for using it on the web.

## Install

Viz.js is published on NPM as `@viz-js/viz`.

## Usage

Call `instance()`, which returns a `Promise` that resolves to a new `Viz` instance. Then call any of the instance's `render` methods to render a graph. A graph can be described using a string in [the DOT language](https://www.graphviz.org/doc/info/lang.html) or a JavaScript object. The `renderSVGElement()` method is convenient for displaying a graph in a webpage.

```js
<script type="module">
  
  import { instance } from "@viz-js/viz";

  instance().then(function(viz) {
    // DOT string
    document.body.appendChild(viz.renderSVGElement("digraph { a -> b }"));
    
    // Graph object
    document.body.appendChild(viz.renderSVGElement({
      edges: [
        { tail: "a", head: "b" }
      ]
    }));
  });

</script>
```

See the examples directory for more.

## API

This section describes the API for this tree. For the current release docs, see [NPM](https://www.npmjs.com/package/@viz-js/viz).

### Modules

<dl>
<dt><a href="#module_viz">viz</a></dt>
<dd></dd>
</dl>

### Classes

<dl>
<dt><a href="#Viz">Viz</a></dt>
<dd><p>Wraps an instance of the Emscripten module used to call Graphviz.
Use <a href="#module_viz.instance">instance</a> to create a new instance of this class.</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#Graph">Graph</a> : <code>object</code></dt>
<dd><p>An object representing a graph.</p>
</dd>
<dt><a href="#Attributes">Attributes</a> : <code>Object.&lt;string, AttributeValue&gt;</code></dt>
<dd><p>An object representing the attributes for a graph, node, or edge.
Used to specify attributes in <a href="#Graph">Graph</a>, <a href="#Node">Node</a>, <a href="#Edge">Edge</a>, or <a href="#Subgraph">Subgraph</a>, and default attributes in <a href="#RenderOptions">RenderOptions</a>.</p>
</dd>
<dt><a href="#AttributeValue">AttributeValue</a> : <code>string</code> | <code>number</code> | <code>boolean</code> | <code><a href="#HTMLString">HTMLString</a></code></dt>
<dd><p>Values that can be specified for <a href="#Attributes">Attributes</a>.</p>
</dd>
<dt><a href="#HTMLString">HTMLString</a> : <code>object</code></dt>
<dd><p>An HTML string attribute value.
This can be used to create <a href="https://www.graphviz.org/doc/info/shapes.html#html">HTML-like labels</a>.</p>
</dd>
<dt><a href="#Node">Node</a> : <code>object</code></dt>
<dd><p>An object representing a node in a <a href="#Graph">Graph</a>.</p>
</dd>
<dt><a href="#Edge">Edge</a> : <code>object</code></dt>
<dd><p>An object representing a edge in a <a href="#Graph">Graph</a>.</p>
</dd>
<dt><a href="#Subgraph">Subgraph</a> : <code>object</code></dt>
<dd><p>An object representing a subgraph in a <a href="#Graph">Graph</a>.</p>
</dd>
<dt><a href="#RenderOptions">RenderOptions</a> : <code>object</code></dt>
<dd><p>Options for <a href="#Viz+render">render</a> and other render methods.</p>
</dd>
<dt><a href="#RenderResult">RenderResult</a> : <code><a href="#SuccessResult">SuccessResult</a></code> | <code><a href="#FailureResult">FailureResult</a></code></dt>
<dd><p>An object representing the result of rendering. See <a href="#Viz+render">render</a>.</p>
</dd>
<dt><a href="#SuccessResult">SuccessResult</a> : <code>object</code></dt>
<dd><p>Returned by <a href="#Viz+render">render</a> when rendering is successful.</p>
</dd>
<dt><a href="#FailureResult">FailureResult</a> : <code>object</code></dt>
<dd><p>Returned by <a href="#Viz+render">render</a> when rendering is unsuccessful.</p>
</dd>
<dt><a href="#RenderError">RenderError</a> : <code>object</code></dt>
<dd><p>A warning or error message emitted by Graphviz during rendering.</p>
</dd>
</dl>

<a name="module_viz"></a>

### viz

* [viz](#module_viz)
    * [.graphvizVersion](#module_viz.graphvizVersion) : <code>string</code>
    * [.formats](#module_viz.formats) : <code>Array.&lt;string&gt;</code>
    * [.engines](#module_viz.engines) : <code>Array.&lt;string&gt;</code>
    * [.instance()](#module_viz.instance) ⇒ [<code>Promise.&lt;Viz&gt;</code>](#Viz)

<a name="module_viz.graphvizVersion"></a>

#### viz.graphvizVersion : <code>string</code>
A string indicating the version of Graphviz used for this build.
This records the value of [graphvizVersion](#Viz+graphvizVersion) at build time and can be used without creating an instance of the [Viz](#Viz) class.

**Kind**: static constant of [<code>viz</code>](#module_viz)  
<a name="module_viz.formats"></a>

#### viz.formats : <code>Array.&lt;string&gt;</code>
An array of strings indicating the supported Graphviz output formats in this build.
This records the value of [formats](#Viz+formats) at build time and can be used without creating an instance of the [Viz](#Viz) class.

**Kind**: static constant of [<code>viz</code>](#module_viz)  
<a name="module_viz.engines"></a>

#### viz.engines : <code>Array.&lt;string&gt;</code>
An array of strings indicating the supported Graphviz layout engines in this build.
This records the value of [engines](#Viz+engines) at build time and can be used without creating an instance of the [Viz](#Viz) class.

**Kind**: static constant of [<code>viz</code>](#module_viz)  
<a name="module_viz.instance"></a>

#### viz.instance() ⇒ [<code>Promise.&lt;Viz&gt;</code>](#Viz)
Returns a promise that resolves to an instance of the [Viz](#Viz) class.
This function encapsulates instantiating the Emscripten module.

**Kind**: static method of [<code>viz</code>](#module_viz)  
<a name="Viz"></a>

### Viz
Wraps an instance of the Emscripten module used to call Graphviz.
Use [instance](#module_viz.instance) to create a new instance of this class.

**Kind**: global class  
**Access**: package  

* [Viz](#Viz)
    * [.graphvizVersion](#Viz+graphvizVersion) ⇒ <code>string</code>
    * [.formats](#Viz+formats) ⇒ <code>Array.&lt;string&gt;</code>
    * [.engines](#Viz+engines) ⇒ <code>Array.&lt;string&gt;</code>
    * [.render(input, [options])](#Viz+render) ⇒ [<code>RenderResult</code>](#RenderResult)
    * [.renderString(input, [options])](#Viz+renderString) ⇒ <code>string</code>
    * [.renderSVGElement(input, [options])](#Viz+renderSVGElement) ⇒ <code>SVGSVGElement</code>
    * [.renderJSON(input, [options])](#Viz+renderJSON) ⇒ <code>object</code>

<a name="Viz+graphvizVersion"></a>

#### viz.graphvizVersion ⇒ <code>string</code>
Returns a string indicating the version of Graphviz available at runtime.
The constant[graphvizVersion](#module_viz.graphvizVersion) records the value of this method at build time.

**Kind**: instance property of [<code>Viz</code>](#Viz)  
<a name="Viz+formats"></a>

#### viz.formats ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of strings indicating the supported Graphviz output formats at runtime.
The constant [formats](#module_viz.formats) records the value of this method at build time.

**Kind**: instance property of [<code>Viz</code>](#Viz)  
<a name="Viz+engines"></a>

#### viz.engines ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of strings indicating the supported Graphviz layout engines at runtime.
The constant [engines](#module_viz.engines) records the value of this method at build time.

**Kind**: instance property of [<code>Viz</code>](#Viz)  
<a name="Viz+render"></a>

#### viz.render(input, [options]) ⇒ [<code>RenderResult</code>](#RenderResult)
Renders the graph described by the input and returns an object representing the result of rendering.

**Kind**: instance method of [<code>Viz</code>](#Viz)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>input</td><td><code>string</code> | <code><a href="#Graph">Graph</a></code></td>
    </tr><tr>
    <td>[options]</td><td><code><a href="#RenderOptions">RenderOptions</a></code></td>
    </tr>  </tbody>
</table>

<a name="Viz+renderString"></a>

#### viz.renderString(input, [options]) ⇒ <code>string</code>
Renders the input and returns the result as a string.
This method accepts the same options as [render](#Viz+render).

**Kind**: instance method of [<code>Viz</code>](#Viz)  
**Throws**:

- Throws an error if rendering failed.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>input</td><td><code>string</code> | <code><a href="#Graph">Graph</a></code></td>
    </tr><tr>
    <td>[options]</td><td><code><a href="#RenderOptions">RenderOptions</a></code></td>
    </tr>  </tbody>
</table>

<a name="Viz+renderSVGElement"></a>

#### viz.renderSVGElement(input, [options]) ⇒ <code>SVGSVGElement</code>
Convenience method that parses the output and returns an SVG element that can be inserted into the document.
This method accepts the same options as [render](#Viz+render), except the format option is always "svg".

**Kind**: instance method of [<code>Viz</code>](#Viz)  
**Throws**:

- Throws an error if rendering failed.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>input</td><td><code>string</code> | <code><a href="#Graph">Graph</a></code></td>
    </tr><tr>
    <td>[options]</td><td><code><a href="#RenderOptions">RenderOptions</a></code></td>
    </tr>  </tbody>
</table>

<a name="Viz+renderJSON"></a>

#### viz.renderJSON(input, [options]) ⇒ <code>object</code>
Convenience method that renders the input, parses the output, and returns a JSON object.
If rendering failed, it throws an error.
This method accepts the same options as [render](#Viz+render), except that the format option is always "json".

**Kind**: instance method of [<code>Viz</code>](#Viz)  
**Throws**:

- Throws an error if rendering failed.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>input</td><td><code>string</code> | <code><a href="#Graph">Graph</a></code></td>
    </tr><tr>
    <td>[options]</td><td><code><a href="#RenderOptions">RenderOptions</a></code></td>
    </tr>  </tbody>
</table>

<a name="Graph"></a>

### Graph : <code>object</code>
An object representing a graph.

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[name]</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>[strict]</td><td><code>boolean</code></td><td><code>false</code></td>
    </tr><tr>
    <td>[directed]</td><td><code>boolean</code></td><td><code>true</code></td>
    </tr><tr>
    <td>[graphAttributes]</td><td><code><a href="#Attributes">Attributes</a></code></td><td></td>
    </tr><tr>
    <td>[nodeAttributes]</td><td><code><a href="#Attributes">Attributes</a></code></td><td></td>
    </tr><tr>
    <td>[edgeAttributes]</td><td><code><a href="#Attributes">Attributes</a></code></td><td></td>
    </tr><tr>
    <td>[nodes]</td><td><code><a href="#Node">Array.&lt;Node&gt;</a></code></td><td></td>
    </tr><tr>
    <td>[edges]</td><td><code><a href="#Edge">Array.&lt;Edge&gt;</a></code></td><td></td>
    </tr><tr>
    <td>[subgraphs]</td><td><code><a href="#Subgraph">Array.&lt;Subgraph&gt;</a></code></td><td></td>
    </tr>  </tbody>
</table>

**Example**  
```js
{
  edges: [
    { tail: "a", head: "b" }
  ]
}
```
**Example**  
```js
{
  directed: false,
  nodeAttributes: { style: "filled", fontcolor: "white" },
  edges: [
    { tail: "a", head: "b", attributes: { label: "1" } },
    { tail: "b", head: "c", attributes: { label: "2" } },
    { tail: "c", head: "a", attributes: { label: "3" } }
  ],
  nodes: [
    { name: "a", attributes: { color: "red" } },
    { name: "b", attributes: { color: "green" } },
    { name: "c", attributes: { color: "blue" } }
  ]
}
```
<a name="Attributes"></a>

### Attributes : <code>Object.&lt;string, AttributeValue&gt;</code>
An object representing the attributes for a graph, node, or edge.
Used to specify attributes in [Graph](#Graph), [Node](#Node), [Edge](#Edge), or [Subgraph](#Subgraph), and default attributes in [RenderOptions](#RenderOptions).

**Kind**: global typedef  
**Example**  
```js
{
  color: "blue",
  width: 1,
  label: { html: "<i>Viz.js</i>" }
}
```
<a name="AttributeValue"></a>

### AttributeValue : <code>string</code> \| <code>number</code> \| <code>boolean</code> \| [<code>HTMLString</code>](#HTMLString)
Values that can be specified for [Attributes](#Attributes).

**Kind**: global typedef  
<a name="HTMLString"></a>

### HTMLString : <code>object</code>
An HTML string attribute value.
This can be used to create <a href="https://www.graphviz.org/doc/info/shapes.html#html">HTML-like labels</a>.

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>html</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
{ html: "<i>Hello!</i>" }
```
<a name="Node"></a>

### Node : <code>object</code>
An object representing a node in a [Graph](#Graph).

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>string</code></td>
    </tr><tr>
    <td>[attributes]</td><td><code><a href="#Attributes">Attributes</a></code></td>
    </tr>  </tbody>
</table>

<a name="Edge"></a>

### Edge : <code>object</code>
An object representing a edge in a [Graph](#Graph).

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>tail</td><td><code>string</code></td>
    </tr><tr>
    <td>head</td><td><code>string</code></td>
    </tr><tr>
    <td>[attributes]</td><td><code><a href="#Attributes">Attributes</a></code></td>
    </tr>  </tbody>
</table>

<a name="Subgraph"></a>

### Subgraph : <code>object</code>
An object representing a subgraph in a [Graph](#Graph).

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[name]</td><td><code>string</code></td>
    </tr><tr>
    <td>[graphAttributes]</td><td><code><a href="#Attributes">Attributes</a></code></td>
    </tr><tr>
    <td>[nodeAttributes]</td><td><code><a href="#Attributes">Attributes</a></code></td>
    </tr><tr>
    <td>[edgeAttributes]</td><td><code><a href="#Attributes">Attributes</a></code></td>
    </tr><tr>
    <td>[nodes]</td><td><code><a href="#Node">Array.&lt;Node&gt;</a></code></td>
    </tr><tr>
    <td>[edges]</td><td><code><a href="#Edge">Array.&lt;Edge&gt;</a></code></td>
    </tr><tr>
    <td>[subgraphs]</td><td><code><a href="#Subgraph">Array.&lt;Subgraph&gt;</a></code></td>
    </tr>  </tbody>
</table>

<a name="RenderOptions"></a>

### RenderOptions : <code>object</code>
Options for [render](#Viz+render) and other render methods.

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[format]</td><td><code>string</code></td><td><code>&quot;dot&quot;</code></td>
    </tr><tr>
    <td>[engine]</td><td><code>string</code></td><td><code>&quot;dot&quot;</code></td>
    </tr><tr>
    <td>[yInvert]</td><td><code>boolean</code></td><td><code>false</code></td>
    </tr><tr>
    <td>[reduce]</td><td><code>boolean</code></td><td><code>false</code></td>
    </tr><tr>
    <td>[graphAttributes]</td><td><code><a href="#Attributes">Attributes</a></code></td><td></td>
    </tr><tr>
    <td>[nodeAttributes]</td><td><code><a href="#Attributes">Attributes</a></code></td><td></td>
    </tr><tr>
    <td>[edgeAttributes]</td><td><code><a href="#Attributes">Attributes</a></code></td><td></td>
    </tr>  </tbody>
</table>

<a name="RenderResult"></a>

### RenderResult : [<code>SuccessResult</code>](#SuccessResult) \| [<code>FailureResult</code>](#FailureResult)
An object representing the result of rendering. See [render](#Viz+render).

**Kind**: global typedef  
<a name="SuccessResult"></a>

### SuccessResult : <code>object</code>
Returned by [render](#Viz+render) when rendering is successful.

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>status</td><td><code>&quot;success&quot;</code></td>
    </tr><tr>
    <td>output</td><td><code>string</code></td>
    </tr><tr>
    <td>errors</td><td><code><a href="#RenderError">Array.&lt;RenderError&gt;</a></code></td>
    </tr>  </tbody>
</table>

<a name="FailureResult"></a>

### FailureResult : <code>object</code>
Returned by [render](#Viz+render) when rendering is unsuccessful.

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>status</td><td><code>&quot;failure&quot;</code></td>
    </tr><tr>
    <td>output</td><td><code>undefined</code></td>
    </tr><tr>
    <td>errors</td><td><code><a href="#RenderError">Array.&lt;RenderError&gt;</a></code></td>
    </tr>  </tbody>
</table>

<a name="RenderError"></a>

### RenderError : <code>object</code>
A warning or error message emitted by Graphviz during rendering.

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[level]</td><td><code>&quot;error&quot;</code> | <code>&quot;warning&quot;</code></td>
    </tr><tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

