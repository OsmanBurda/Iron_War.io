const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// OSMAN'IN BÖLGE AYARLARI (Sunucu Tarafı)
const MAP_SIZE = 10000;
const CENTER = 5000;
const ELMAS_RADIUS = 1200;
const ALTIN_RADIUS = 3500;

// Objeleri oluştururken hangi bölgede olduklarını sunucu hesaplar
function getObjectTier(x, y) {
    const dist = Math.sqrt(Math.pow(x - CENTER, 2) + Math.pow(y - CENTER, 2));
    if (dist < ELMAS_RADIUS) return "E"; // Elmas Merkez
    if (dist < ALTIN_RADIUS) return "A"; // Altın Orta
    return "N"; // Normal Dış
}

// Statik dosyaları (HTML, Resimler) istemciye sunar
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('Bir oyuncu bağlandı: ' + socket.id);
    
    // Oyuncu bilgilerini ve E-A-N bölgelerini buraya ekleyebilirsin
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Sunucu ' + PORT + ' portunda çalışıyor...');
});
