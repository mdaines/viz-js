importScripts("bower_components/viz.js/viz.js");

onmessage = function(e) {
  var result = Viz(e.data.src, e.data.options);
  postMessage(result);
}
