const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/splits", require("./routes/splitRoutes"));

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
  });
});

module.exports = app;
