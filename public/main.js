document.addEventListener('DOMContentLoaded', function(event) {
  utils.settings = settings;

  var ws = new WebSocket(`ws://${location.host}`);

  ws.onerror = function() {
    console.log('WebSocket error');
  };

  ws.onopen = function() {
    utils.debug('WebSocket connection established');
    ws.send('')
  };

  ws.onclose = function() {
    console.log('WebSocket connection closed');
  };

  ws.onmessage = function (message) {
    messageData = JSON.parse(message.data);
    if (messageData.event == 'waiting_for_player_2') {
      output = document.createElement('p');
      output.textContent = "You're player 1, waiting for player 2.";
      var serverMessages = document.getElementById('server_messages');
      serverMessages.appendChild(output);
    } else if (messageData.event == 'game_found') {
      output = document.createElement('p');
      output.textContent = "Game found, you're player 2.";
      var serverMessages = document.getElementById('server_messages');
      serverMessages.appendChild(output);
    }
  }
});
