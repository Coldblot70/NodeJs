const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('hello'));
const server = app.listen(port, () => console.log('Server Start!!!'));

const io = require('socket.io')(server);

allPlayers = [];

