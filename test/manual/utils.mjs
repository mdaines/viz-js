export function makeGraph(n) {
  let src = "digraph { ";
  for (let i = 0; i < n; i++) {
    src += `node${i}; `;
  }
  src += "} ";

  return src;
}
