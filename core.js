(function core (exports) {
  exports.Game = function (clients) {
    this.clients = clients
  }

  exports.Game.prototype.update = function (params) {
    console.log('Updating game!')
    for (var client of this.clients) {
      if (client.id === params.clientId) {
        if (params.action === 'jump') {
          client.position[1] += 1
        }
      }
    }
  }
})(typeof exports === 'undefined' ? window.multiplayer.core = {} : exports)
