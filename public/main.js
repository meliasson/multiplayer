document.addEventListener('DOMContentLoaded', function(event) {
  utils.settings = settings;

  var ws = new WebSocket(`ws://${location.host}`);

  ws.onerror = function() {
    utils.debug('WebSocket error');
  };

  ws.onopen = function() {
    utils.debug('WebSocket connection established');
    // ws.send('I connected!')
  };

  ws.onclose = function() {
    utils.debug('WebSocket connection closed');
  };

  ws.onmessage = function (message) {
    utils.debug('Received message %s', message.data);
    messageData = JSON.parse(message.data);
    output = document.createElement('p');
    output.textContent = messageData.event;
    var serverMessages = document.getElementById('server_messages');
    serverMessages.appendChild(output);
  }
});
