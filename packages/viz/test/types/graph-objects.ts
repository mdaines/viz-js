import { instance } from "@viz-js/viz";

instance().then(viz => {
  viz.render({});

  viz.render({
    edges: [
      { tail: "a", head: "b" }
    ]
  });

  viz.render({
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
  });

  viz.render({
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
  });

  viz.render({
    graphAttributes: {
      // @ts-expect-error
      blah: null
    }
  });

  viz.render({
    graphAttributes: {
      // @ts-expect-error
      label: { stuff: "abc" }
    }
  });

  viz.render({
    subgraphs: [
      {
        // @ts-expect-error
        directed: false
      }
    ]
  });

  viz.render({
    subgraphs: [
      {
        // @ts-expect-error
        strict: true
      }
    ]
  });

  // @ts-expect-error
  viz.render({ a: "b" });
});
