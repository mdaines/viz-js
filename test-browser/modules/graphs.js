QUnit.module("graphs");

QUnit.test("rendering sample graphs should not throw errors", function(assert) {
  var graphs = [
    "digraph g {\n  n1 [shape = circle];\n  n2 [shape = egg];\n  n3 [shape = triangle];\n  n4 [shape = diamond];\n  n5 [shape = trapezium];\n}",
    "digraph g {\n    \n  {rank = same; n1; n2; n3; n4; n5}\n  \n  n1 -> n2;\n  n2 -> n3;\n  n3 -> n4;\n  n4 -> n5;\n  \n  subgraph cluster1 {\n    label = \"cluster1\";\n    color = lightgray;\n    style = filled;\n    \n    n6;\n  }\n  \n  subgraph cluster2 {\n    label = \"cluster2\";\n    color = red;\n    \n    n7;\n    n8;\n  }\n  \n  n1 -> n6;\n  n2 -> n7;\n  n8 -> n3;\n  n6 -> n7;\n  \n}",
    "digraph g {\nnode001->node002;\nsubgraph cluster1 {\n    node003;\n    node004;\n    node005;\n}\nnode006->node002;\nnode007->node005;\nnode007->node002;\nnode007->node008;\nnode002->node005[label=\"x\"];\nnode004->node007;\n}"
  ];
  
  var results = graphs.map(function(graph) {
    var viz = new Viz();
      
    return viz.renderString(graph)
    .then(function(str) { assert.ok(str); });
  });
  
  return Promise.all(results);
});
