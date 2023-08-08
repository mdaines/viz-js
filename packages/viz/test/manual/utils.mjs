export function randomGraph(nodeCount, randomEdgeCount = 0) {
  const result = {
    nodes: [],
    edges: []
  };

  for (let i = 0; i < nodeCount; i++) {
    result.nodes.push({ name: `node${i}` });
  }

  for (let i = 0; i < randomEdgeCount; i++) {
    const t = Math.floor(nodeCount * Math.random());
    const h = Math.floor(nodeCount * Math.random());

    result.edges.push({ tail: `node${t}`, head: `node${h}` });
  }

  return result;
}

export function dotStringify(obj) {
  const edges = Array.from(obj);
  const result = [];

  result.push("digraph {\n");

  for (const node of obj.nodes) {
    result.push(node.name, ";\n");
  }

  for (const edge of obj.edges) {
    result.push(edge.tail, " -> ", edge.head, ";\n");
  }

  result.push("}\n");

  return result.join("");
}
