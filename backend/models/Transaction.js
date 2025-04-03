const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["credit", "debit"],
      required: true, 
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    unit:{
        type: String,
    },
    category: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Transaction", expenseSchema);

module.exports = Expense;
