const express = require('express');
const app = express();
const host = '127.0.0.1';
const port = 3000;

app.use(express.static(__dirname+'/html'));
app.get('/', (req, res) => res.send('index.html'));
const server = app.listen(port,host, () => console.log('Server Start!!!'));

const io = require('socket.io')(server);

allPlayers = [];
io.on("connection", (socket) => {
    socket.on("allPlayer", (s) => {
        if (allPlayers.length <= 2) {
            allPlayers.push(s.name);
        }
        if (allPlayers.length >=2 ) {
            io.emit("playersComplete", { players:allPlayers });
        }
    });
    socket.on("userScore", (score) => {
        socket.broadcast.emit("userScore", { userScore: score.score})
    });
});

