(function utils (exports) {
  exports.debug = function () {
    if (this.settings.logLevel === 'debug') {
      console.log.apply(this, arguments)
    }
  }
})(typeof exports === 'undefined' ? window.multiplayer.utils = {} : exports)
