const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");

const Split = require("../models/Split");
const Transaction = require("../models/Transaction");
const Group = require("../models/Group");
const Chat = require("../models/Chat");
const User = require("../models/User");

const createTransactionWithSplit = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      date,
      description,
      group,
      splitBetween,
      chatMembers,
    } = req.body;

    if (!splitBetween || splitBetween.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one member must be selected for split" });
    }

    const transaction = new Transaction({
      user: req.user.id,
      title,
      amount,
      category,
      date,
      description,
      paymentType: "debit",
      unit: "INR",
    });

    await transaction.save();

    // Divide amount among selected members
    const splitAmount = amount / splitBetween.length;

    // Create Split record
    const splitRecord = new Split({
      group,
      expense: transaction._id,
      splitPayer: req.user.id,
      splitBetween: splitBetween.map((memberId) => ({
        member: memberId,
        amount: splitAmount,
        hasPaid: false,
      })),
    });

    await splitRecord.save();

    // find the group and add the split record to it
    const result = await Group.findByIdAndUpdate(
      group,
      { $push: { splits: splitRecord._id } },
      { new: true }
    );

    if (!result) {
      return ApiResponse(404, "Group not found", null, res);
    }

    // Update transaction with reference to Split
    transaction.split = splitRecord._id;
    await transaction.save();

    // Create a chat for the split members
    const members = chatMembers || [...splitBetween, req.user._id];

    // Ensure unique members (no duplicates)
    const uniqueMembers = [...new Set(members)];

    // Create a chat for the split
    const chat = new Chat({
      groupId: group,
      members: uniqueMembers.map((memberId) => ({
        userId: memberId,
      })),
    });

    await chat.save();

    // Update the split record with the chat reference
    splitRecord.chat = chat._id;
    await splitRecord.save();

    return ApiResponse(
      201,
      "Transaction and split created successfully",
      { transaction, splitRecord, chat },
      res
    );
  } catch (error) {
    console.error("Error in createTransactionWithSplit:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { splitId, memberId } = req.body;

    const split = await Split.findById(splitId).populate("expense", "name category");
    const splitPayer = await User.findById(memberId);
    const paidTo = await User.findById(split.splitPayer);

    if (!split)
      return res.status(404).json({ error: "Split record not found" });

    const transaction = new Transaction({
      user: split.splitPayer,
      paymentType: "credit",
      title: `Payment recieved for split ${split.expense.name} from ${splitPayer.name}`,
      amount: split.splitBetween.find(
        (detail) => detail.member.toString() === memberId
      ).amount,
      date: new Date(),
      description: `Payment for split ${split.expense.title} from ${splitPayer.name}`,
      group: split.expense.category,
    });

   
    await transaction.save();

   
    const payerTransaction = new Transaction({
      user: memberId,
      paymentType: "debit",
      title: `Payment done to ${splitPayer.name} for split ${split.expense.title}`,
      amount: split.splitBetween.find(
        (detail) => detail.member.toString() === memberId
      ).amount,
      date: new Date(),
      description: `Payment done to ${paidTo.name} for split ${split.expense.title}`,
      group: split.expense.category,
    });

 
    await payerTransaction.save();

    let isAlreadyPaid = false;
    split.splitBetween = split.splitBetween.map((detail) => {
      if (detail.member.toString() === memberId) {
        if (detail.hasPaid) isAlreadyPaid = true;
        return { ...detail, hasPaid: true };
      }
      return detail;
    });

    if (isAlreadyPaid) {
      return ApiResponse(400, "Member has already paid", null, res);
    }

    await split.save();

    return ApiResponse(
      200,
      "Payment status updated successfully",
      { split },
      res
    );
  } catch (error) {
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const getAllSplits = async (req, res) => {
  try {
    const splits = await Split.find({})
      .populate("expense")
      .populate("splitPayer")
      .populate("splitBetween.member", "name email phoneNo");

    return ApiResponse(200, "Splits retrieved successfully", splits, res);
  } catch (error) {
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const getSplitById = async (req, res) => {
  try {
    const { splitId } = req.params;
    const split = await Split.findById(splitId)
      .populate("expense")
      .populate("splitPayer")
      .populate("splitBetween.member", "name email phoneNo");

    if (!split)
      return res.status(404).json({ error: "Split record not found" });

    return ApiResponse(200, "Split retrieved successfully", split, res);
  } catch (error) {
    return ApiResponse(500, "Internal server error", null, res);
  }
};

module.exports = {
  createTransactionWithSplit,
  updatePaymentStatus,
  getAllSplits,
  getSplitById,
};
