const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// --- OSMAN'IN AYARLARI ---
const MAP_SIZE = 10000;
const CENTER = 5000;
const ELMAS_RADIUS = 1500; // E Bölgesi Sınırı
const ALTIN_RADIUS = 3800; // A Bölgesi Sınırı

// Harita üzerindeki objeleri bölgelere göre ayırarak oluştur
function createWorld() {
    let objects = [];
    for(let i = 0; i < 4000; i++) {
        let rx = Math.random() * MAP_SIZE;
        let ry = Math.random() * MAP_SIZE;
        
        // Merkeze uzaklık hesabı
        let dist = Math.sqrt(Math.pow(rx - CENTER, 2) + Math.pow(ry - CENTER, 2));
        
        let tier;
        if (dist < ELMAS_RADIUS) {
            tier = "E"; // Sadece Elmas Bölgesi
        } else if (dist < ALTIN_RADIUS) {
            tier = "A"; // Sadece Altın Bölgesi
        } else {
            tier = "N"; // Sadece Normal Bölge
        }

        // Rastgele tür belirle (Para, Dişli, Kasa, Jeneratör)
        const rand = Math.random();
        let kind = "PARA";
        if(rand > 0.95) kind = "JEN";
        else if(rand > 0.85) kind = "KASA";
        else if(rand > 0.70) kind = "DISLI";

        objects.push({
            id: i,
            x: rx,
            y: ry,
            kind: kind,
            tier: tier,
            hp: tier === "E" ? 200 : (tier === "A" ? 80 : 20)
        });
    }
    return objects;
}

let worldObjects = createWorld();

// Statik klasör (public klasörü içindeki HTML/Görseller için)
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    // Oyuncuya dünya bilgilerini gönder
    socket.emit('init', {
        objects: worldObjects,
        mapSize: MAP_SIZE,
        center: CENTER
    });

    console.log('Osman, bir oyuncu bağlandı ID: ' + socket.id);
});

// Port Ayarı (Render için 3000 veya process.env.PORT)
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Sunucu ' + PORT + ' portunda canavar gibi calisiyor!');
});
