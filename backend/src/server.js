import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocket } from "./sockets/index.js";

const PORT = process.env.PORT || 5004;
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});
app.set("io", io);
setupSocket(io);

connectDB()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`[SERVER] Lumo Market API on port ${PORT}`),
    );
  })
  .catch((err) => {
    console.error("[DB]", err);
    process.exit(1);
  });
