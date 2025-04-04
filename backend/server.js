require("dotenv").config();
const http = require("http");
const app = require("./app");
const socketSetup = require("./socket/socket");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
socketSetup(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
