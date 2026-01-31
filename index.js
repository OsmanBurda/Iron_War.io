const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname));
let players = {};
io.on('connection', (socket) => {
    socket.on('join', (data) => {
        players[socket.id] = { id: socket.id, x: 5000, y: 5000, name: data.name, xp: 0, level: 1 };
        socket.emit('init', { id: socket.id });
    });
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].angle = data.angle;
        }
    });
    socket.on('disconnect', () => { delete players[socket.id]; });
});
setInterval(() => { io.emit('update', players); }, 20);
http.listen(process.env.PORT || 3000);
