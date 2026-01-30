const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Dosyaların yerini garantiye alalım
const publicPath = path.join(__dirname);
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('Oyuncu bağlandı: ' + socket.id);
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Sunucu ' + PORT + ' portunda bembeyaz!'));
