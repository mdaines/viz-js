import {
  strict,
  graph,
  digraph,
  subgraph,
  node,
  edge
} from "./parser.terms.js";

const keywordMap = {
  strict,
  graph,
  digraph,
  subgraph,
  node,
  edge
};

export function keywords(name) {
  let found = keywordMap[name.toLowerCase()];
  return found == null ? -1 : found;
}
