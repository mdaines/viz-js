Viz = function(src, format) {
  format = format || "svg";
  var Module = {};
  Module["return"] = "";
  Module["print"] = function(text) {
    Module["return"] += text + "\n";
  }
