const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let players = {};
let flags = {
    red: { x: 50, y: 300, owner: null },
    blue: { x: 750, y: 300, owner: null }
};

io.on('connection', (socket) => {
    // Osman: 3 Can ve Başlangıç Ayarları
    players[socket.id] = {
        x: 400, y: 300,
        score: 0, lives: 3,
        team: null,
        hasFlag: false
    };

    socket.on('setTeam', (team) => {
        // Sadece bayrak kapmaca modunda takım seçimi
        players[socket.id].team = team;
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Sunucu 3000 portunda hazır!'));
