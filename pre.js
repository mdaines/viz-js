window["Viz"] = function(src, format, engine) {
  if (typeof(engine) === 'undefined') {
    engine = 'dot';
  }
  var Module = {};
  Module["return"] = "";
  Module["print"] = function(text) {
    Module["return"] += text + "\n";
  }
