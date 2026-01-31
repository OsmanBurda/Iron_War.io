const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const MAP_SIZE = 10000; [cite: 2026-01-27]
let players = {};
let bullets = [];

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        players[socket.id] = { 
            id: socket.id, x: 5000, y: 5000, 
            name: data.name || "Osman", angle: 0, 
            hp: 3 [cite: 2026-01-27], lastShoot: 0 
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
        if (p && now - p.lastShoot > 1000) { [cite: 2026-01-27]
            p.lastShoot = now;
            [0, Math.PI/2, Math.PI, Math.PI*1.5].forEach(ang => {
                bullets.push({ x: p.x, y: p.y, angle: ang, owner: socket.id, life: 100 });
            }); [cite: 2026-01-27]
        }
    });

    socket.on('special', () => { if(players[socket.id]) console.log("B Power!"); }); [cite: 2026-01-27]
    socket.on('disconnect', () => { delete players[socket.id]; });
});

setInterval(() => {
    bullets.forEach((b, i) => {
        b.x += Math.cos(b.angle) * 15; b.y += Math.sin(b.angle) * 15; b.life--;
        if(b.life <= 0) bullets.splice(i, 1);
    });
    io.emit('update', { players, bullets });
}, 20);

http.listen(process.env.PORT || 3000);
