document.addEventListener("DOMContentLoaded", function(event) {
  utils.settings = settings;

  var ws = new WebSocket(`ws://${location.host}`);

  ws.onerror = function() {
    console.log("WebSocket error");
  };

  ws.onopen = function() {
    utils.debug("WebSocket connection established");
  };

  ws.onclose = function() {
    console.log("WebSocket connection closed");
  };

  ws.onmessage = function (event) {
    var newMessage = document.createElement("p");
    newMessage.textContent = event.data;
    var serverMessages = document.getElementById('server_messages');
    serverMessages.appendChild(newMessage);
    // serverMessages = getElementById('server_messages');
    // console.log("received:", event.data);
  }
});
