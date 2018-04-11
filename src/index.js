class WorkerWrapper {
  constructor(url) {
    this.worker = new Worker(url);
    this.listeners = [];
    this.nextId = 0;
    
    this.worker.addEventListener('message', (event) => {
      let id = event.data.id;
      let error = event.data.error;
      let result = event.data.result;

      this.listeners[id](error, result);
      delete this.listeners[id];
    });
  }
  
  render(src, options) {
    return new Promise((resolve, reject) => {
      let id = this.nextId++;
    
      this.listeners[id] = function(error, result) {
        if (error) {
          reject(new Error(error.message, error.fileName, error.lineNumber));
          return;
        }
        resolve(result);
      };
    
      this.worker.postMessage({ id, src, options });
    });
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

function defaultScale() {
  if ('devicePixelRatio' in window && window.devicePixelRatio > 1) {
    return window.devicePixelRatio;
  } else {
    return 1;
  }
}

function svgXmlToImageElement(svgXml, { scale = defaultScale(), mimeType = "image/png", quality = 1 } = {}) {
  return new Promise((resolve, reject) => {
    let svgImage = new Image();

    svgImage.onload = function() {
      let canvas = document.createElement('canvas');
      canvas.width = svgImage.width * scale;
      canvas.height = svgImage.height * scale;

      let context = canvas.getContext("2d");
      context.drawImage(svgImage, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(blob => {
        let image = new Image();
        image.src = URL.createObjectURL(blob);
        image.width = svgImage.width;
        image.height = svgImage.height;
        
        resolve(image);
      }, mimeType, quality);
    }

    svgImage.onerror = function(e) {
      var error;
  
      if ('error' in e) {
        error = e.error;
      } else {
        error = new Error('Error loading SVG');
      }
  
      reject(error);
    }

    svgImage.src = 'data:image/svg+xml;base64,' + b64EncodeUnicode(svgXml);
  });
}

function svgXmlToImageElementFabric(svgXml, { scale = defaultScale(), mimeType = 'image/png', quality = 1 } = {}) {
  let multiplier = scale;
  
  let format;
  if (mimeType == 'image/jpeg') {
    format = 'jpeg';
  } else if (mimeType == 'image/png') {
    format = 'png';
  }
  
  return new Promise((resolve, reject) => {
    fabric.loadSVGFromString(svgXml, function(objects, options) {
      // If there's something wrong with the SVG, Fabric may return an empty array of objects. Graphviz appears to give us at least one <g> element back even given an empty graph, so we will assume an error in this case.
      if (objects.length == 0) {
        reject(new Error('Error loading SVG with Fabric'));
      }

      let element = document.createElement("canvas");
      element.width = options.width;
      element.height = options.height;

      let canvas = new fabric.Canvas(element, { enableRetinaScaling: false });
      let obj = fabric.util.groupSVGElements(objects, options);
      canvas.add(obj).renderAll();

      let image = new Image();
      image.src = canvas.toDataURL({ format, multiplier, quality });
      image.width = options.width;
      image.height = options.height;
      
      resolve(image);
    });
  });
}

function wrapRender(fn) {
  return {
    render: function(src, options) {
      return new Promise((resolve, reject) => {
        try {
          resolve(fn(src, options));
        } catch (error) {
          reject(error);
        }
      });
    }
  };
}

class Viz {
  constructor({ worker, render } = {}) {
    if (typeof worker !== 'undefined') {
      this.wrapper = new WorkerWrapper(worker);
    } else if (typeof render !== 'undefined') {
      this.wrapper = wrapRender(render);
    } else if (typeof Viz.render !== 'undefined') {
      this.wrapper = wrapRender(Viz.render);
    } else {
      throw new Error(`Must specify worker or render options, or include one of viz.module.js or viz-lite.module.js after viz.js.`);
    }
  }
  
  renderString(src, { format = 'svg', engine = 'dot', files = [], images = [], yInvert = false } = {}) {
    for (let i = 0; i < images.length; i++) {
      files.push({
        path: images[i].path,
        data: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="${images[i].width}" height="${images[i].height}"></svg>`
      });
    }
    
    return this.wrapper.render(src, { format, engine, files, images, yInvert });
  }
  
  renderSVGElement(src, options = {}) {
    return this.renderString(src, { ...options, format: 'svg' })
    .then(str => {
      let parser = new DOMParser();
      return parser.parseFromString(str, 'image/svg+xml').documentElement;
    });
  }
  
  renderImageElement(src, options = {}) {
    let { scale, mimeType, quality } = options;

    return this.renderString(src, { ...options, format: 'svg' })
    .then(str => {
      if (typeof fabric === "object" && fabric.loadSVGFromString) {
        return svgXmlToImageElementFabric(str, { scale, mimeType, quality });
      } else {
        return svgXmlToImageElement(str, { scale, mimeType, quality });
      }
    });
  }
  
  renderJSONObject(src, options = {}) {
    let { format } = options;
    
    if (format !== 'json' || format !== 'json0') {
      format = 'json';
    }
    
    return this.renderString(src, { ...options, format })
    .then(str => {
      return JSON.parse(str);
    });
  }
}

export default Viz;
