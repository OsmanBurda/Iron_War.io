const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    players[socket.id] = { 
        x: 1500, y: 1500, id: socket.id, 
        name: "Osman", 
        color: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe_nMarGj4bTgbT3erB8NoJGVamlFJFQf5KNAuWOvfnQ&s=10" 
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

// RENDER İÇİN ÖZEL PORT AYARI
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
