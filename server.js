const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const { Socket } = require("dgram");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

server.listen(3000);
app.use(express.static(path.join(__dirname, "public")));

let connectedUSers = [];

io.on('connection', (socket) => {
    console.log('Conectado');

    socket.on('join-request', (username) => {
        socket.username = username;
        connectedUSers.push(username);
        console.log(connectedUSers);

        socket.emit('user-ok', connectedUSers);

        
    });

});
