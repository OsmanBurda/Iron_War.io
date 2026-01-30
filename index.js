const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    // Yeni oyuncu bağlandığında
    players[socket.id] = { 
        x: 1500, 
        y: 1500, 
        id: socket.id, 
        name: "Osman",
        color: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NPrkQ7yE9Z08S5XkG9D9Q9J-uG8n7f-GgA&s" // Ronaldo
    };
    
    socket.emit('currentPlayers', players);

    // Başla butonuna basıldığında ismi ve kostümü güncelle
    socket.on('startGame', (data) => {
        if (players[socket.id]) {
            players[socket.id].name = data.name;
            players[socket.id].color = data.color;
            io.emit('updatePlayerInfo', players[socket.id]);
        }
    });

    // Hareket verisi
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Ronaldo Kostümü Hazır!'));
