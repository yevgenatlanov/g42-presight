import { Server } from "socket.io";
import http from "http";

let io: Server;

export function setupSocketServer(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: "*", // this is not for production for sure
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

export { io };
