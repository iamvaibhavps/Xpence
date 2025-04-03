const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    chatId: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },
    attachments: [
      {
        url: {
          type: String,
          trim: true,
        },
        fileType: {
          type: String,
          trim: true,
        },
      },
    ],
    readBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
