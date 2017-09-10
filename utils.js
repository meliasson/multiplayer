(function initUtils(exports) {
  exports.log = function() {
    if (verbose === true) {
      console.log.apply(this, arguments);
    }
  };
})(typeof exports === 'undefined'? this['utils'] = {} : exports);
