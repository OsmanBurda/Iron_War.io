const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Dosyaların nerede olduğunu belirler
app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    // Osman: 3 Can ve Takım Ayarları
    players[socket.id] = {
        x: 400, y: 300,
        score: 0, lives: 3,
        team: null
    };
    console.log('Bir oyuncu bağlandı:', socket.id);

    socket.on('disconnect', () => {
        delete players[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Sunucu ' + PORT + ' portunda hazır!'));
