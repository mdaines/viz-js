  return Module;
};

function render(src, options) {
  var graphviz = Module();
  
  var i;
  for (i = 0; i < options.files.length; i++) {
    graphviz['ccall']('vizCreateFile', 'number', ['string', 'string'], [options.files[i].path, options.files[i].data]);
  }

  graphviz['ccall']('vizSetY_invert', 'number', ['number'], [options.yInvert ? 1 : 0]);
  
  var resultPointer = graphviz['ccall']('vizRenderFromString', 'number', ['string', 'string', 'string'], [src, options.format, options.engine]);
  var resultString = graphviz['Pointer_stringify'](resultPointer);
  graphviz['ccall']('free', 'number', ['number'], [resultPointer]);

  var errorMessagePointer = graphviz['ccall']('vizLastErrorMessage', 'number', [], []);
  var errorMessageString = graphviz['Pointer_stringify'](errorMessagePointer);
  graphviz['ccall']('free', 'number', ['number'], [errorMessagePointer]);

  if (errorMessageString != '') {
    throw new Error(errorMessageString);
  }
  
  return resultString;
}

if (typeof WorkerGlobalScope !== 'undefined') {
  onmessage = function(event) {
    var id = event.data.id;
    var src = event.data.src;
    var options = event.data.options;
  
    try {
      var result = render(src, options);
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
