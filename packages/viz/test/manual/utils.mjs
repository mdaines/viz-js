export function makeGraph(nodeCount, randomEdgeCount = 0) {
  let src = "digraph { ";

  for (let i = 0; i < nodeCount; i++) {
    src += `node${i}; `;
  }

  for (let i = 0; i < randomEdgeCount; i++) {
    const s = Math.floor(nodeCount * Math.random());
    const t = Math.floor(nodeCount * Math.random());

    src += `node${s} -> node${t}; `;
  }

  src += "}";

  return src;
}
