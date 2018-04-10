  return Module;
};

var graphviz;

function render(src, format, engine) {
  if (typeof graphviz === 'undefined') {
    graphviz = Module();
  }
  
  var resultPointer = graphviz['ccall']('vizRenderFromString', 'number', ['string', 'string', 'string'], [src, format, engine]);
  var resultString = graphviz['Pointer_stringify'](resultPointer);
  graphviz['ccall']('free', 'number', ['number'], [resultPointer]);

  var errorMessagePointer = graphviz['ccall']('vizLastErrorMessage', 'number', [], []);
  var errorMessageString = graphviz['Pointer_stringify'](errorMessagePointer);
  graphviz['ccall']('free', 'number', ['number'], [errorMessagePointer]);

  if (errorMessageString != '') {
    graphviz = undefined;
    throw new Error(errorMessageString);
  }
  
  return resultString;
}

if (typeof WorkerGlobalScope !== 'undefined') {
  onmessage = function(event) {
    var id = event.data.id;
    var src = event.data.src;
    var format = event.data.format;
    var engine = event.data.engine;
  
    try {
      var result = render(src, format, engine);
      postMessage({ id: id, result: result });
    } catch (error) {
      postMessage({ id: id, error: { message: error.message, fileName: error.fileName, lineNumber: error.lineNumber } });
    }
  }
}

if (typeof define === 'function' && define.amd) {
  define([], function() { return { render: render, Module: Module }; });
} else if (typeof module === 'object' && module.exports) {
  module.exports = { render: render, Module: Module };
}

if (typeof global.Viz !== 'undefined') {
  global.Viz.render = render;
  global.Viz.Module = Module;
}

})(typeof self !== 'undefined' ? self : this);
