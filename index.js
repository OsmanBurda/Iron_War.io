const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const MAP_SIZE = 10000; // Harita boyutu tam 10000
const CENTER = 5000;

app.use(express.static(__dirname));

function createWorld() {
    let objects = [];
    for(let i = 0; i < 2500; i++) {
        let rx = Math.random() * MAP_SIZE;
        let ry = Math.random() * MAP_SIZE;
        let dist = Math.sqrt(Math.pow(rx - CENTER, 2) + Math.pow(ry - CENTER, 2));
        
        let tier = dist < 1500 ? "E" : (dist < 3800 ? "A" : "N");
        let kind = Math.random() > 0.9 ? "JEN" : (Math.random() > 0.8 ? "KASA" : (Math.random() > 0.7 ? "DISLI" : "PARA"));

        objects.push({ id: i, x: rx, y: ry, kind: kind, tier: tier });
    }
    return objects;
}

let worldObjects = createWorld();
let players = {};

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        players[socket.id] = { id: socket.id, x: CENTER, y: CENTER, name: data.name, angle: 0 };
        socket.emit('init', { objects: worldObjects, id: socket.id });
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
