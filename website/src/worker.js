import { instance } from "@viz-js/viz";

const vizPromise = instance();

async function render({ src, options }) {
  const viz = await vizPromise;

  try {
    postMessage({ status: "fulfilled", value: viz.render(src, options) });
  } catch (error) {
    postMessage({ status: "rejected", reason: error.toString() });
  }
}

self.onmessage = function(event) {
  render(event.data);
}
