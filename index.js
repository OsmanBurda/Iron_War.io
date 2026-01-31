const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const MAP_SIZE = 10000; [cite: 2026-01-27]
let players = {};

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        players[socket.id] = { id: socket.id, x: 5000, y: 5000, name: data.name || "Osman", angle: 0, hp: 3 }; [cite: 2026-01-27]
        socket.emit('init', { id: socket.id, mapSize: MAP_SIZE });
    });

    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].angle = data.angle;
        }
    });
    
    socket.on('shoot', () => { /* 4 yönlü ateş mantığı */ }); [cite: 2026-01-27]
    socket.on('disconnect', () => { delete players[socket.id]; });
});

setInterval(() => { io.emit('update', players); }, 20);
http.listen(process.env.PORT || 3000);
