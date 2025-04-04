const express = require("express");
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/get-all-chats", authMiddleware, chatController.getAllChats);

router.post("/create-chat", authMiddleware, chatController.createChat);
router.get("/get-all-messages/:id", authMiddleware, chatController.getChatById);
router.post("/send-message", authMiddleware, chatController.sendMessage);

router.put("/update-chat/:id", authMiddleware, chatController.updateChatById);

router.post(
  "/delete-all-messages",
  authMiddleware,
  chatController.deleteAllMessages
);
router.post("/delete-chat", authMiddleware, chatController.deleteChatById);

module.exports = router;
