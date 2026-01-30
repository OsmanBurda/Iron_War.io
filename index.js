const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Dosyaların ana klasörde olduğunu belirtir
app.use(express.static(__dirname));

// Ana sayfaya girildiğinde index.html'i gönderir
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Oyuncu bağlantılarını dinler
io.on('connection', (socket) => {
    console.log('Bir oyuncu bağlandı: ' + socket.id);
    
    socket.on('disconnect', () => {
        console.log('Oyuncu çıktı.');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Sunucu ' + PORT + ' portunda canavar gibi çalışıyor!');
});
