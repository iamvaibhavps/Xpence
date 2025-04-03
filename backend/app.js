const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
  });
});

module.exports = app;
