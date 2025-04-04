const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const Chat = require("../models/Chat");

const Transaction = require("../models/Transaction");
const Group = require("../models/Group");
const Split = require("../models/Split");

const createGroup = async (req, res) => {
  try {
    const { name, members, description } = req.body;

    if (!name || !members || members.length === 0) {
      return ApiResponse(400, "Group name and members are required", null, res);
    }

    const group = new Group({
      name,
      members,
      description,
    });

    await group.save();

    return ApiResponse(201, "Group created successfully", group, res);
  } catch (error) {
    console.error("Error creating group:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, members, description } = req.body;
    const group = await Group.findByIdAndUpdate(
      groupId,
      { name, members, description },
      { new: true }
    );
    if (!group) {
      return ApiResponse(404, "Group not found", null, res);
    }
    return ApiResponse(200, "Group updated successfully", group, res);
  } catch (error) {
    console.error("Error updating group:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const findAllSplitsOfGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate({
        path: "splits",
        populate: [
          { path: "expense" },
          { path: "splitPayer", select: "name email phoneNo" },
          {
            path: "splitBetween.member",
            select: "name phoneNo email",
            model: "User",
          },
        ],
      })
      .populate("members", "name email phoneNo");

    if (!group) {
      return ApiResponse(404, "Group not found", null, res);
    }
    return ApiResponse(200, "Splits retrieved successfully", group.splits, res);
  } catch (error) {
    console.error("Error retrieving splits:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const findAllTransactionsofGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate("splits");
    if (!group) {
      return ApiResponse(404, "Group not found", null, res);
    }
    return ApiResponse(
      200,
      "Transactions retrieved successfully",
      group.transactions,
      res
    );
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const getAllGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.find({
      members: userId,
      name: { $ne: "Personal" },
    })
      .populate("members", "name email phoneNo")
      .sort({ createdAt: -1 });

    return ApiResponse(200, "Groups retrieved successfully", groups, res);
  } catch (error) {
    console.error("Error retrieving groups:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return ApiResponse(404, "Group not found", null, res);
    }

    const splitResponse = await Split.find({ group: groupId });

    const transactionIds = splitResponse.map((split) => split.expense);
    const chatIds = group.splits.map((split) => split.chatId);

    await Transaction.deleteMany({ _id: { $in: transactionIds } });
    await Chat.deleteMany({ _id: { $in: chatIds } });

    await Group.findByIdAndDelete(groupId);

    return ApiResponse(200, "Group deleted successfully", null, res);
  } catch (error) {
    console.error("Error deleting group:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

module.exports = {
  createGroup,
  updateGroup,
  findAllSplitsOfGroup,
  findAllTransactionsofGroup,
  getAllGroups,
  deleteGroup,
};
