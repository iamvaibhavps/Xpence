const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/all", authMiddleware, notificationController.getAllNotifications);

router.put(
  "/:id/read",
  authMiddleware,
  notificationController.readNotification
);

module.exports = router;
