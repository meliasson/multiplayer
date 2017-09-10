var express = require('express');
var http = require('http');
var path = require('path');
var uuidv1 = require('uuid/v1');
var WebSocket = require('ws');

var utils = require('./utils');

// Express

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.get('/favicon.ico', function(req, res) {
  res.status(204);
});
app.get('/', function(req, res) {
  res.render('pages/index', {
    connectionsCount: wss.clients.size
  });
});
app.get('/*', function(req, res, next) {
  var file = req.params[0];
  res.sendFile(__dirname + '/' + file);
});

// WebSocket

var server = http.createServer(app);
var wss = new WebSocket.Server({ server });
wss.on('connection', function connection(client, req) {
  client.id = uuidv1();
  utils.log('Client %s connected', client.id);

  client.on('message', function incoming(message) {
    console.log('Client %s sent %s', client.id, message);
  });

  client.on('close', function incoming(message) {
    console.log('Client %s closed connection', client.id);
    this.terminate();
  });

  client.send(JSON.stringify({ event: 'connection_established', id: client.id }));
  gameState = joinOrCreateGame(client.id);
  client.send(JSON.stringify({ event: gameState }));
});

// Game lobby

var games = new Map();
function joinOrCreateGame(userId) {
  if (games.size === 0) {
    newGame = { id: uuidv1(), player_1: userId };
    games.set(newGame.id, newGame);
    return 'waiting_for_player_2'
  }
  else {
    for (var [gameId, game] of games) {
      if (game.player_2 === undefined) {
        game.player_2 = uuidv1();
        return 'game_found'
      }
    }
    newGame = { id: uuidv1(), player_1: userId };
    games.set(newGame.id, newGame);
    return 'waiting_for_player_2'
  }
}

// Game loops

function physicsLoop()
{
  for (var [gameId, game] of games) {
    if (game.player_2 === undefined) {
      continue;
    }

    for (var client of wss.clients) {
      client.send('Hahahaha!');
    }
  }
}

// Start server

server.listen(3000, function listening() {
  console.log('Server listening on port %d', server.address().port);
});

// Start physics loop

setInterval(physicsLoop, 15);
