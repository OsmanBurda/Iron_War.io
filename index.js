const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const MAP_SIZE = 10000;
const CENTER = 5000;
const ELMAS_RADIUS = 1500; // E Bölgesi Sınırı
const ALTIN_RADIUS = 3800; // A Bölgesi Sınırı

// Objeleri oluştururken bölgeye göre kesin tip atıyoruz
function spawnObjects() {
    let objects = [];
    for(let i = 0; i < 4000; i++) {
        let rx = Math.random() * MAP_SIZE;
        let ry = Math.random() * MAP_SIZE;
        let dist = Math.sqrt(Math.pow(rx - CENTER, 2) + Math.pow(ry - CENTER, 2));
        
        let tier;
        if (dist < ELMAS_RADIUS) {
            tier = "E"; // SADECE ELMAS
        } else if (dist < ALTIN_RADIUS) {
            tier = "A"; // SADECE ALTIN
        } else {
            tier = "N"; // SADECE NORMAL
        }

        objects.push({ x: rx, y: ry, tier: tier, id: i });
    }
    return objects;
}

app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Sunucu ' + PORT + ' portunda aktif.');
});
