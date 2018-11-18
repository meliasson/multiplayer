window.multiplayer = {}

window.multiplayer.render = function(clients) {
  var canvas = document.getElementById('game');
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (var client of clients) {
    utils.debug(client);

    var character;

    if (client.id === multiplayer.clientId) {
      character = 'ME';
    }
    else {
      character = 'OPPONENT';
    }

    context.fillText(character, client.position[0] * 30, client.position[1] * 30);
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  utils.settings = settings;

  window.multiplayer.ws = new WebSocket(`ws://${location.host}`);

  window.multiplayer.ws.onerror = function() {
    utils.debug('WebSocket error');
  };

  window.multiplayer.ws.onopen = function() {
    utils.debug('WebSocket connection established');
  };

  window.multiplayer.ws.onclose = function() {
    utils.debug('WebSocket connection closed');
  };

  window.multiplayer.ws.onmessage = function (message) {
    utils.debug('Received message %s', message.data);
    messageData = JSON.parse(message.data);

    if (messageData.status == 'starting') {
      window.multiplayer.clientId = messageData.clientId;
    } else if (messageData.status == 'running') {
      window.multiplayer.render(messageData.clients);
    }

    // if (messageData.status !== 'game_running') {
    //   output = document.createElement('p');
    //   output.textContent = messageData.status;
    //   utils.debug(document.getElementById('messages'));
    //   var messages = document.getElementById('messages');
    //   messages.appendChild(output);
    // }

    // if (messageData.status === 'game_running') {
    //   me = document.createElement('span');
    //   me.classList.add('player');
    //   me.id = 'player1';
    //   opponent = document.createElement('span');
    //   opponent.classList.add('player');
    //   opponent.id = 'player2';
    //   for (var i = 0; i < messageData.positions.length; i++) {
    //     if (messageData.positions[i].player === 'you') {
    //       me.style.left = messageData.positions[0] * 10 + 'px';
    //     } else if (messageData.positions[i].player === 'opponent') {
    //       opponent.style.left = messageData.positions[0] * 10 + 'px';
    //     }
    //   }

    //   var game = document.getElementById('game');
    //   game.appendChild(me);
    //   game.appendChild(opponent);
    // }
  }
});

document.addEventListener("keydown", function(event) {
  utils.debug('Key %s pressed', event.keyCode);
  window.multiplayer.keyDown = event.keyCode;
  window.multiplayer.ws.send(JSON.stringify({ action: 'move' }));
});
