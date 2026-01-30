const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Osman, burası beyaz ekranın anahtarı
app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('Beyaz dünyaya biri katıldı!');
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Sunucu BEYAZ modda hazır!'));
