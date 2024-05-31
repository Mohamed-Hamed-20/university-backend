import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://graduation-project-beryl-seven.vercel.app/",
      "http://localhost:3000",
      "http://graduation-project-beryl-seven.vercel.app/",
    ],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  // make connection
  console.log("user connected", socket.id);
  const userId = socket.handshake.query.userId;

  //
  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  // send event to all connected clinets
  console.log(Object.keys(userSocketMap));
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnected", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
