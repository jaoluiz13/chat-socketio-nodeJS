const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const { Socket } = require("dgram");
const { time } = require("console");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

server.listen(3000);
app.use(express.static(path.join(__dirname, "public")));

let connectedUSers = [];

io.on("connection", (socket) => {
  console.log("Conectado");
  const data = new Date();
  socket.on("join-request", (username) => {
    socket.username = username;
    connectedUSers.push(username);
    console.log(connectedUSers);

    socket.emit("user-ok", connectedUSers);
    let time = "";
    time = data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

    socket.broadcast.emit("list-update", {
      joined: username,
      list: connectedUSers,
      time: time,
    });
  });

  socket.on("disconnect", () => {
    connectedUSers = connectedUSers.filter((u) => u != socket.username);
    console.log(connectedUSers);
    let time = "";
    time = data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
    socket.broadcast.emit("list-update", {
      left: socket.username,
      list: connectedUSers,
      time: time,
    });
  });

  socket.on("send-msg", (msg) => {
    let time = "";
    time = data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
    let obj = {
      username: socket.username,
      message: msg,
      time: time,
    };
    socket.emit("show-msg", obj);
    socket.broadcast.emit("show-msg", obj);
  });
});
