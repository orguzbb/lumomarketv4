export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("[SOCKET] Connected:", socket.id);
    socket.on("join", (userId) => socket.join(`user_${userId}`));
    socket.on("disconnect", () =>
      console.log("[SOCKET] Disconnected:", socket.id),
    );
  });
};
