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
  const lowerCaseName = name.toLowerCase();

  if (!Object.hasOwn(keywordMap, lowerCaseName)) {
    return -1;
  }

  return keywordMap[lowerCaseName];
}
