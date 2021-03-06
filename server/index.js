var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const ROOM_SIZE = 4;
const START_HEALTH = 100;
const MAX_ROOMS = 1000;
const HEALTH_DECAY_RATE = .0006;
let blue_shell_modifier = 0.2;
let room_status = 0;

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
        io.to('Room'+roomKey).emit('game-started-event', updateRoomStatus(roomKey));
      }, 5000+2000);
    }
  });
  // Listens for item usage
  socket.on('use-item', () => {
    // get roomkey
    let socketId = socket.id;
    var roomKey;
    for (const roomKeyCandidate of Object.keys(socket.rooms)) {
      if (roomKeyCandidate != socketId) {
        roomKey = roomKeyCandidate.substring(4,);
        break;
      }
    }
    let socketIds = rooms[roomKey];
    for (var i = 0; i < ROOM_SIZE; i++) { 
      if (playerInfo[socketIds[i]].rank == 1) {
        io.to('Room'+roomKey).emit('blue-turtle-shell', socketId, socketIds[i]);
              console.log(playerInfo[socketIds[i]].username, playerInfo[socketIds[i]].distance);              
      //playerInfo[socketIds[i]].health -= blue_shell_modifier*100;
      playerInfo[socketIds[i]].distance = playerInfo[socketIds[i]].distance *( 1- blue_shell_modifier);           
      console.log(playerInfo[socketIds[i]].username, playerInfo[socketIds[i]].distance);
      }
    }
    console.log("Used Item");
    
    
    var data = updateRoomStatus(roomKey);
    // broadcast updated data to room
    io.to('Room'+roomKey).emit('room-data-event', data);
  });

  socket.on('calibrate-zero', () => {
    // get roomkey
    let socketId = socket.id;
    var roomKey;
    for (const roomKeyCandidate of Object.keys(socket.rooms)) {
      if (roomKeyCandidate != socketId) {
        roomKey = roomKeyCandidate.substring(4,);
        break;
      }
    }
    let socketIds = rooms[roomKey];
    for (var i = 0; i < ROOM_SIZE; i++) {             
      playerInfo[socketIds[i]].health =100;
      playerInfo[socketIds[i]].distance = 0;    
    }
    console.log("Calibrated to zero");
    var data = updateRoomStatus(roomKey);
    // broadcast updated data to room
    io.to('Room'+roomKey).emit('room-data-event', data);
  });
  
  //var numUpdates = 0;
  socket.on('update-status-event', (distance) => {
    //numUpdates++;
    //console.log(numUpdates);
    //if (numUpdates <= 2) return;
    // console.log(socket.id+" walked " + distance);
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
    // console.log(JSON.stringify(rooms));
    // console.log(JSON.stringify(playerInfo));
    var numAlive = 0;
    for (const socketId of data.playerIds) {
      if (data[socketId].alive) numAlive++;
    }
    if (!data[socketId].alive || numAlive <= 1) {
      console.log(data[socketId].username + ' just died');
      for (const id of data.playerIds) {
        if (!data[id].alive) {
          io.to('Room'+roomKey).emit('game-over-event', id, data[id].rank, data[id].username, data[id].distance, data[id].averagespeed);
          setTimeout(() => io.to('Room'+roomKey).emit('game-over-event', id, data[id].rank, data[id].username, data[id].distance, data[id].averagespeed), 2000);
        }
      }
      io.to('Room'+roomKey).emit('game-over-event', socketId, data[socketId].rank, data[socketId].username, data[socketId].distance, data[socketId].averagespeed);
      setTimeout(() => io.to('Room'+roomKey).emit('game-over-event', socketId, data[socketId].rank, data[socketId].username, data[socketId].distance, data[socketId].averagespeed), 2000);
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
