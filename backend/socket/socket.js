const socketIO = require("socket.io");

const socketSetup = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Listen for a request to join a specific chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat room: ${chatId}`);
    });

    // Handle incoming message and emit to the room only
    socket.on("sendMessage", (message) => {
      const { content } = message;
      console.log("message", message);
      // console.log(`Message received in chat room ${chatId}: ${content}`);
      // Broadcast message to all users in the specific chat room
      io.to(message.chatId._id).emit("receiveMessage", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = socketSetup;
