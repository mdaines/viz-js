var fs = require("fs");
var viz = require("./viz");

var path = process.argv[2];

if (fs.existsSync(path)) {

  var src = fs.readFileSync(path);
  var result = viz.ccall("vizRenderFromString", "string", ["string", "string", "string"], [src, "svg", "dot"]);

  console.log(result);
  
} else {
  
  console.error("No file specified");
  
}
