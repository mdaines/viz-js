import { instance } from "@viz-js/viz";

const vizPromise = instance();

export async function dot2svg(src, { engine } = {}) {
  return (await vizPromise).renderString(src, { engine, format: "svg" });
}
