import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { setupSocketServer } from "./socket";

dotenv.config();

const server = http.createServer(app);
const io = setupSocketServer(server);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API: http://localhost:${PORT}/api/users`);
  console.log(`Worker API: http://localhost:${PORT}/api/worker/process`);
  console.log(
    `Redis Worker API: http://localhost:${PORT}/api/redis-worker/process`
  );
});

export { server, io };
