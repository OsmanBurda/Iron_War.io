const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    // Oyuncu ilk bağlandığında geçici veriler
    players[socket.id] = { 
        x: 1500, 
        y: 1500, 
        id: socket.id, 
        lives: 3,
        name: "Adsız",      // Varsayılan İsim
        color: "#3498db"    // Varsayılan Renk (Mavi)
    };
    
    io.emit('currentPlayers', players);

    // OYUNCU "BAŞLA" DEDİĞİNDE BİLGİLERİ GÜNCELLE
    socket.on('startGame', (data) => {
        if (players[socket.id]) {
            players[socket.id].name = data.name;
            players[socket.id].color = data.color;
            // Herkese bu oyuncunun yeni ismini ve rengini duyur
            io.emit('updatePlayerInfo', players[socket.id]);
        }
    });

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
http.listen(PORT, () => console.log('Sunucu Menü Moduyla Hazır!'));
