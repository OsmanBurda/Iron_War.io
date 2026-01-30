const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    players[socket.id] = { 
        x: 1500, y: 1500, id: socket.id, 
        name: "Osman", color: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NPrkQ7yE9Z08S5XkG9D9Q9J-uG8n7f-GgA&s" 
    };
    
    socket.emit('currentPlayers', players);

    socket.on('startGame', (data) => {
        if (players[socket.id]) {
            players[socket.id].name = data.name;
            players[socket.id].color = data.color;
            io.emit('updatePlayerInfo', players[socket.id]);
        }
    });

    socket.on('playerMovement', (mv) => {
        if (players[socket.id]) {
            players[socket.id].x = mv.x;
            players[socket.id].y = mv.y;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

http.listen(process.env.PORT || 3000, () => console.log('Ronaldo ve Messi Hazır!'));
