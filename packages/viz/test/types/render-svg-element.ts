import { instance, type SVGRenderOptions } from "@viz-js/viz";

instance().then(viz => {
  const trustedTypePolicy = {
    createHTML: (input: string) => input
  };

  const result: SVGSVGElement = viz.renderSVGElement("digraph { a -> b }", { trustedTypePolicy });
});
