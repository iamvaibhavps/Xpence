const mongoose = require("mongoose");

const splitSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    expense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    splitPayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    splitBetween: [
      {
        member: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number, required: true },
        hasPaid: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Split = mongoose.model("Split", splitSchema);

module.exports = Split;
