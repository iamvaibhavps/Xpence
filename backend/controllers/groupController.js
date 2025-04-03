const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");

const Group = require("../models/Group");

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
    }
    catch (error) {
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
                model: "User"
                }
            ]
        })
        .populate("members", "name email phoneNo");


        if (!group) {
            return ApiResponse(404, "Group not found", null, res);
        }
        return ApiResponse(200, "Splits retrieved successfully", group.splits, res);
    }
    catch (error) {
        console.error("Error retrieving splits:", error);
        return ApiResponse(500, "Internal server error", null, res);
    }
}

const findAllTransactionsofGroup = async (req, res) => {

    try {

        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate("splits");
        if (!group) {
            return ApiResponse(404, "Group not found", null, res);
        }
        return ApiResponse(200, "Transactions retrieved successfully", group.transactions, res);
    }
    catch (error) {
        console.error("Error retrieving transactions:", error);
        return ApiResponse(500, "Internal server error", null, res);
    }
}


module.exports = {
    createGroup,
    updateGroup,
    findAllSplitsOfGroup,
    findAllTransactionsofGroup
};