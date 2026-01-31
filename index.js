const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// --- OSMAN'IN AYARLARI ---
const MAP_SIZE = 10000;
const CENTER = 5000;
const ELMAS_RADIUS = 1500; // E Bölgesi (Merkez)
const ALTIN_RADIUS = 3800; // A Bölgesi (Orta)

// Siyah ekranı bitiren kritik kısım: Statik dosyaları tanıtıyoruz
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Objeleri bölgelere göre kesin ayırıyoruz (N'de asla altın çıkmaz)
function createWorld() {
    let objects = [];
    for(let i = 0; i < 3000; i++) {
        let rx = Math.random() * MAP_SIZE;
        let ry = Math.random() * MAP_SIZE;
        let dist = Math.sqrt(Math.pow(rx - CENTER, 2) + Math.pow(ry - CENTER, 2));
        
        let tier;
        if (dist < ELMAS_RADIUS) {
            tier = "E"; // Sadece Elmas
        } else if (dist < ALTIN_RADIUS) {
            tier = "A"; // Sadece Altın
        } else {
            tier = "N"; // Sadece Normal
        }

        const r = Math.random();
        let kind = "PARA";
        if(r > 0.96) kind = "JEN";
        else if(r > 0.90) kind = "KASA";
        else if(r > 0.75) kind = "DISLI";

        objects.push({ id: i, x: rx, y: ry, kind: kind, tier: tier });
    }
    return objects;
}

let worldObjects = createWorld();

io.on('connection', (socket) => {
    // Oyuncuya dünya verisini gönder
    socket.emit('init', { objects: worldObjects });
    console.log('Osman, oyun bağlantısı başarılı!');
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Sunucu ' + PORT + ' portunda çalışıyor...');
});
