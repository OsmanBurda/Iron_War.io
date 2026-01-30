const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    // Yeni oyuncu eklendiğinde (Osman: 3 Can kuralı dahil)
    players[socket.id] = { x: 1500, y: 1500, id: socket.id, lives: 3 };
    
    // Tüm oyunculara yeni gelen kişiyi bildir
    io.emit('currentPlayers', players);

    // Hareket verisi geldiğinde güncelle
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
http.listen(PORT, () => console.log('Savaş başladı! Port: ' + PORT));
