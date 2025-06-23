import { Viz } from "./viz.js";

export function instance() {
  return (new Viz()).load();
}
