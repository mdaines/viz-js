import { type Graph } from "@viz-js/viz";

let graph: Graph;

graph = {};

graph = {
  edges: [
    { tail: "a", head: "b" }
  ]
};

graph = {
  directed: false,
  strict: false,
  name: "G",
  graphAttributes: {
    label: "Test"
  },
  edgeAttributes: {
    color: "green"
  },
  nodeAttributes: {
    shape: "circle"
  },
  nodes: [
    { name: "a", attributes: { label: "A" } }
  ],
  edges: [
    { tail: "a", head: "b", attributes: { label: "test" } }
  ],
  subgraphs: [
    {
      name: "cluster1",
      graphAttributes: {
        color: "green"
      },
      edgeAttributes: {
        color: "blue"
      },
      nodeAttributes: {
        color: "red"
      },
      subgraphs: [
        {
          nodes: [
            { name: "b" }
          ]
        }
      ]
    }
  ]
};

graph = {
  graphAttributes: {
    width: 2,
    abc: true,
    label: { html: "<b>test</b>" }
  },
  nodes: [
    {
      name: "a",
      attributes: {
        width: 2,
        abc: true,
        label: { html: "<b>test</b>" }
      }
    }
  ]
};

graph = {
  graphAttributes: {
    // @ts-expect-error
    blah: null
  }
};

graph = {
  graphAttributes: {
    // @ts-expect-error
    label: { stuff: "abc" }
  }
};

graph = {
  subgraphs: [
    {
      // @ts-expect-error
      directed: false
    }
  ]
};

graph = {
  subgraphs: [
    {
      // @ts-expect-error
      strict: true
    }
  ]
};

// @ts-expect-error
graph = { a: "b" };
