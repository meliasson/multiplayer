window.multiplayer = {
  clients: []
}

window.multiplayer.render = function (game) {
  var canvas = document.getElementById('game')
  var context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)

  for (var client of game.clients) {
    var character

    if (client.id === this.clientId) {
      character = 'YOU'
    } else {
      character = '666'
    }

    context.fillText(character, client.position[0], client.position[1])
  }
}

window.multiplayer.update = function (params) {
  this.game.update({ clientId: this.clientId, action: params.action })
}

window.multiplayer.reset = function (clients) {
  this.game.clients = clients
}

document.addEventListener('DOMContentLoaded', function (event) {
  window.multiplayer.utils.settings = window.multiplayer.settings

  window.multiplayer.ws = new window.WebSocket(`ws://${window.location.host}`)

  window.multiplayer.ws.onerror = function () {
    window.multiplayer.utils.debug('WebSocket error')
  }

  window.multiplayer.ws.onopen = function () {
    window.multiplayer.utils.debug('WebSocket connection established')
  }

  window.multiplayer.ws.onclose = function () {
    window.multiplayer.utils.debug('WebSocket connection closed')
  }

  window.multiplayer.ws.onmessage = function (message) {
    var messageData = JSON.parse(message.data)

    if (messageData.status === 'starting') {
      window.multiplayer.clientId = messageData.clientId
    } else if (messageData.status === 'running') {
      window.multiplayer.game = new window.multiplayer.core.Game(messageData.clients)
      window.multiplayer.reset(messageData.clients)
      window.multiplayer.render(window.multiplayer.game)
    }
  }
})

document.addEventListener('keydown', function (event) {
  if (event.keyCode === 32) {
    window.multiplayer.ws.send(JSON.stringify({ action: 'jump' }))
    window.multiplayer.update({ action: 'jump' })
    window.multiplayer.render(window.multiplayer.game)
  }
})
