const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

let players = {};

io.on('connection', (socket) => {
    // Yeni oyuncu bağlandığında varsayılan değerler
    players[socket.id] = { 
        x: 1500, 
        y: 1500, 
        id: socket.id, 
        lives: 3, // VS modunda 3 can kuralın
        name: "Osman", // Senin adın
        color: "DEFAULT_BLUE" // Burası artık hem renk hem resim linki tutuyor
    };
    
    // Mevcut oyuncuları yeni gelene gönder
    socket.emit('currentPlayers', players);

    // OYUNCU "BAŞLA" DEDİĞİNDE (Menüden gelen bilgiler)
    socket.on('startGame', (data) => {
        if (players[socket.id]) {
            players[socket.id].name = data.name;
            players[socket.id].color = data.color; // HTML'den gelen resim linkini buraya kaydeder
            // Herkese bu oyuncunun yeni ismini ve kostümünü (resmini) duyur
            io.emit('updatePlayerInfo', players[socket.id]);
        }
    });

    // Hareket verilerini al ve herkese yay
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            // Diğer oyunculara senin yerini bildir
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

// Port ayarı
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Sunucu Kostüm Sistemiyle Başlatıldı!'));
