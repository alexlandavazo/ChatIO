import http from "http";
import nanobuffer from "nanobuffer";
import { Server } from "socket.io";
import express from "express";

const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();
const app = express();
const server = http.createServer(app);

msg.push({
  user: "Jando",
  text: "Hellow!! 🤟",
  time: Date.now(),
});

// serve static assets
app.get("/", (req, res) => {
  res.send({ msg: getMsgs() });
});

const io = new Server(server, {});
io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.emit("msg:get", { msg: getMsgs() });

  socket.on("disconnect", () => {
    console.log(`disconnected: ${socket.id}`);
  });

  socket.on("msg:post", (data) => {
    msg.push({
      user: data.user,
      text: data.text,
      time: Date.now(),
    });
    io.emit("msg:get", { msg: getMsgs() });
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
