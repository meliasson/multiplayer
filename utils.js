(function utils(exports) {
  exports.debug = function() {
    if (this.settings.logLevel === 'debug') {
      console.log.apply(this, arguments);
    }
  };
})(typeof exports === 'undefined' ? this['utils'] = {} : exports);
