const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const MAP_SIZE = 10000;
let players = {};

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        // 3 CAN VE VS MODU AYARLARI
        players[socket.id] = { 
            id: socket.id, x: 5000, y: 5000, 
            name: data.name || "Osman", angle: 0, 
            hp: 3, lastShoot: 0 
        };
        socket.emit('init', { id: socket.id, mapSize: MAP_SIZE });
    });

    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].angle = data.angle;
        }
    });

    socket.on('shoot', () => {
        const p = players[socket.id];
        const now = Date.now();
        if (p && now - p.lastShoot > 1000) { // 1 Saniye Cooldown
            p.lastShoot = now;
            io.emit('bullet', { owner: socket.id, x: p.x, y: p.y });
        }
    });

    socket.on('disconnect', () => { delete players[socket.id]; });
});

setInterval(() => { io.emit('update', players); }, 20);
http.listen(process.env.PORT || 3000);
