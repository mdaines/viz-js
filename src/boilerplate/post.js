if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports = Viz;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return Viz; });
} else {
  global.Viz = Viz;
}

})(this);
