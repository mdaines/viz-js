import Module from "../lib/module.mjs";
import { decode } from "../lib/encoded.mjs";
import { getGraphvizVersion, getPluginList, renderInput } from "./wrapper.mjs";

export class Viz {
  get graphvizVersion() {
    this.assertLoaded();

    return getGraphvizVersion(this.module);
  }

  get formats() {
    this.assertLoaded();

    return getPluginList(this.module, "device");
  }

  get engines() {
    this.assertLoaded();

    return getPluginList(this.module, "layout");
  }

  get isLoaded() {
    return typeof this.module !== "undefined";
  }

  async load() {
    this.module = await Module({ wasm: decode() });
    return this;
  }

  assertLoaded() {
    if (!this.isLoaded) {
      throw new Error("Viz is not loaded. Call `await Viz.load()` first.");
    }
  }

  renderFormats(input, formats, options = {}) {
    this.assertLoaded();

    return renderInput(this.module, input, formats, { engine: "dot", ...options });
  }

  render(input, options = {}) {
    this.assertLoaded();

    let format;

    if (options.format === void 0) {
      format = "dot";
    } else {
      format = options.format;
    }

    let result = renderInput(this.module, input, [format], { engine: "dot", ...options });

    if (result.status === "success") {
      result.output = result.output[format];
    }

    return result;
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
