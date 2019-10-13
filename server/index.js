var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const ROOM_SIZE = 5;
const START_HEALTH = 100;
const MAX_ROOMS = 1000;
const HEALTH_DECAY_RATE = .0002;

var playerInfo = {}; // dictionary of socket/player id and in-game info

var rooms = {}; // dictionary of room keys and list of socket/player

var lastRefreshed = {} // dictionary of room keys and time (msec) at last update
var roomStartTime = {} // dictionary of room keys and time at game creation

// returns room number
function findRoom(socketId) {
  for (const roomKey of Object.keys(rooms)) {
    if (rooms[roomKey].length < ROOM_SIZE) {
      rooms[roomKey].push(socketId);
      return roomKey;
    }
  }
  var newRoomKey;
  do {
    newRoomKey = Math.floor(Math.random()*MAX_ROOMS);
  } while (newRoomKey in rooms)
  rooms[newRoomKey] = [socketId];
  return newRoomKey;
}

function initializePlayer(socketId, username) {
  playerInfo[socketId] = {
    'username': username,
    'distance': 0,
    'health': START_HEALTH,
    'averagespeed': 0,
    'alive': true,
    'rank': 1
  };
}

// return updated data to broadcast to the room
function updateRoomStatus(roomKey) {
  let socketIds = rooms[roomKey];
  let gameData = {'playerIds': socketIds};
  for (var i = 0; i < ROOM_SIZE; i++) {
    gameData[socketIds[i]] = playerInfo[socketIds[i]];
  }
  let timeElapsed = (new Date().getTime() - lastRefreshed[roomKey])/1000; //sec
  // update ranks
  let distances = []
  for (const socketId of gameData.playerIds) {
    distances.push(gameData[socketId].distance);
    gameData[socketId].rank = -1;
  }
  distances.sort((a,b)=>b-a);
  let maxDistance = distances[0];
  for (var i = 0; i < ROOM_SIZE; i++) {
    for (const socketId of gameData.playerIds) {
      if (gameData[socketId].rank == -1 && distances[i] == gameData[socketId].distance) {
        gameData[socketId].rank = i+1;
        break;
      }
    }
  }
  // update average speeds
  for (const socketId of gameData.playerIds) {
    gameData[socketId].averagespeed =
      gameData[socketId].distance / (new Date().getTime() - roomStartTime[roomKey]) * 1000;
  }
  // decrement health
  for (const socketId of gameData.playerIds) {
    gameData[socketId].health -= HEALTH_DECAY_RATE * timeElapsed * (maxDistance - gameData[socketId].distance);
    if (gameData[socketId].health <= 0) {
      gameData[socketId].health = 0;
      gameData[socketId].alive = false;
    }
  }
  return gameData;
}

app.get('/', function(req, res){
  res.send('Hello World');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('find-game-event', (username) => {
    let roomKey = findRoom(socket.id);
    socket.join('Room'+roomKey);
    initializePlayer(socket.id, username);
    console.log(rooms[roomKey].length);
    console.log(ROOM_SIZE);
    io.to('Room'+roomKey).emit('find-game-event', ({num_joined: rooms[roomKey].length,
                                                     room_size: ROOM_SIZE}));
    if (rooms[roomKey].length == ROOM_SIZE) {
      io.to('Room'+roomKey).emit('game-found-event');
      setTimeout(() => {
        lastRefreshed[roomKey] = new Date().getTime();
        roomStartTime[roomKey] = new Date().getTime();
        io.to('Room'+roomKey).emit('game-started-event');
      }, 5000);
    }
  });

  //var numUpdates = 0;
  socket.on('update-status-event', (distance) => {
    //numUpdates++;
    //console.log(numUpdates);
    //if (numUpdates <= 2) return;
    console.log(socket.id+" walked " + distance);
    let socketId = socket.id;
    playerInfo[socketId].distance += distance;
    // get roomkey
    var roomKey;
    for (const roomKeyCandidate of Object.keys(socket.rooms)) {
      if (roomKeyCandidate != socketId) {
        roomKey = roomKeyCandidate.substring(4,);
        break;
      }
    }
    var data = updateRoomStatus(roomKey);
    // broadcast updated data to room
    io.to('Room'+roomKey).emit('room-data-event', data);
    console.log(JSON.stringify(rooms));
    console.log(JSON.stringify(playerInfo));
    var numAlive = 0;
    for (const socketId of data.playerIds) {
      if (data[socketId].alive) numAlive++;
    }
    if (!data[socketId].alive || numAlive <= 1) {
      socket.emit('game-over-event', data[socketId].rank);

      if (data[socketId].rank == 1) {
        delete rooms[roomKey];
        delete lastRefreshed[roomKey];
        delete roomStartTime[roomKey];
      }
    }
  });

  // socket.on('Event Name', callback)
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
