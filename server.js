var express = require('express');
var http = require('http');
var path = require('path');
var uuidv1 = require('uuid/v1');
var WebSocket = require('ws');

var utils = require('./utils');
var settings = require('./settings');
utils.settings = settings;

var games = new Map();

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
  utils.debug('Client %s connected', client.id);
  joinGame(games, client);
  client.send(JSON.stringify({ status: 'starting', clientId: client.id }));

  client.on('message', function incoming(message) {
    utils.debug('Client %s sent %s', client.id, message);
    messageData = JSON.parse(message);
    if (messageData.action == 'move') {
      // client.position = [client.position[0] + 1, client.position[1]];
    }
  });

  client.on('close', function incoming(message) {
    utils.debug('Client %s closed connection', client.id);
    this.terminate();
  });
});

// Game lobby

function joinGame(games, client) {
  var gameToJoin;

  if (games.size) {
    for (var [gameId, game] of games) {
      if (game.clients.length < 2) {
        utils.debug('Client joining game');
        gameToJoin = game;
      }
    }
  }

  if (!gameToJoin) {
    utils.debug('Client creating game');
    gameToJoin = { id: uuidv1(), clients: [], status: 'running' };
  }

  client.position = getInitialClientPosition(gameToJoin);
  gameToJoin.clients.push(client);
  games.set(gameToJoin.id, gameToJoin);
}

function getInitialClientPosition(game) {
  return [Math.floor(Math.random() * Math.floor(10)), 0];
}

// Game loops

function physicsLoop() {
  for (var [gameId, game] of games) {
    clients = [];

    for (var client of game.clients) {
      clients.push({ id: client.id, position: client.position })
    }

    message = JSON.stringify({ status: game.status, clients: clients });

    for (var client of game.clients) {
      client.send(message);
    }
  }
}

// Start server

server.listen(3000, function listening() {
  utils.debug('Server listening on port %d', server.address().port);
});

// Start physics loop

setInterval(physicsLoop, 1000);
