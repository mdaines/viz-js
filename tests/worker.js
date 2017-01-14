var config = JSON.parse(decodeURIComponent(self.location.search.slice(1)));

importScripts(config.path);

onmessage = function(e) {
  var result = Viz(e.data.src, e.data.options);
  postMessage(result);
}
