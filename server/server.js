import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

//stuff
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = {};

app.get("/", (req, res) => res.send("<h1>Server is on</h1>"));

io.on("connection", (socket) => {
  //events:
  socket.on("join", (name) => {
    users[socket.id] = name;
    io.emit("user-joined", name);
  });
  socket.on('disconnect', () => {
    if (users[socket.id])
        io.emit('user-left', users[socket.id])
        users[socket.id] = null;
  })
  socket.on("msg", (chat_msg) => socket.broadcast.emit("chat_msg", chat_msg)); // server emits the message to all the other clients
});

server.listen(port, () => console.log(`Server listening on ${port}`));
