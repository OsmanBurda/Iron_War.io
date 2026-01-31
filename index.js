const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const MAP_SIZE = 10000; [cite: 2026-01-27]
let players = {};

app.use(express.static(__dirname));

function createWorld() {
    let objects = [];
    for(let i = 0; i < 1500; i++) {
        let rx = Math.random() * MAP_SIZE;
        let ry = Math.random() * MAP_SIZE;
        let dist = Math.sqrt(Math.pow(rx - 5000, 2) + Math.pow(ry - 5000, 2));
        let tier = dist < 1500 ? "E" : (dist < 3800 ? "A" : "N");
        let kind = Math.random() > 0.8 ? "JEN" : (Math.random() > 0.6 ? "KASA" : "PARA");
        objects.push({ id: i, x: rx, y: ry, kind: kind, tier: tier });
    }
    return objects;
}
let worldObjects = createWorld();

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        players[socket.id] = { id: socket.id, x: 5000, y: 5000, name: data.name || "Osman", angle: 0, score: 0 };
        socket.emit('init', { objects: worldObjects, id: socket.id, mapSize: MAP_SIZE });
    });

    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].angle = data.angle;
            
            // Eşya toplama kontrolü (Basit mesafe kontrolü)
            worldObjects.forEach((obj, index) => {
                let d = Math.sqrt(Math.pow(obj.x - data.x, 2) + Math.pow(obj.y - data.y, 2));
                if (d < 40) {
                    players[socket.id].score += 10;
                    worldObjects.splice(index, 1);
                    io.emit('objectCollected', { id: obj.id, playerId: socket.id });
                }
            });
        }
    });

    socket.on('disconnect', () => { delete players[socket.id]; });
});

setInterval(() => { io.emit('update', players); }, 20);

const PORT = process.env.PORT || 3000; [cite: 2026-01-26]
http.listen(PORT, () => console.log("Iron War Hazir!"));
