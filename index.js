const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// --- OSMAN'IN BÖLGE AYARLARI ---
const MAP_SIZE = 10000;
const CENTER = 5000;
const ELMAS_RADIUS = 1500; 
const ALTIN_RADIUS = 3800;

// Statik dosyaları sunmak için (Siyah ekranı bu çözer)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

function createWorld() {
    let objects = [];
    for(let i = 0; i < 2000; i++) {
        let rx = Math.random() * MAP_SIZE;
        let ry = Math.random() * MAP_SIZE;
        let dist = Math.sqrt(Math.pow(rx - CENTER, 2) + Math.pow(ry - CENTER, 2));
        
        let tier;
        if (dist < ELMAS_RADIUS) tier = "E"; 
        else if (dist < ALTIN_RADIUS) tier = "A";
        else tier = "N";

        const r = Math.random();
        let kind = r > 0.95 ? "JEN" : (r > 0.85 ? "KASA" : (r > 0.70 ? "DISLI" : "PARA"));

        objects.push({ id: i, x: rx, y: ry, kind: kind, tier: tier });
    }
    return objects;
}

let worldObjects = createWorld();

io.on('connection', (socket) => {
    socket.emit('init', { objects: worldObjects });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log('Sunucu Hazır!'); });
