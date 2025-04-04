const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Create a new chat
exports.createChat = async (req, res) => {
    const { groupId, members } = req.body;

    if (!groupId || !Array.isArray(members)) {
        return ApiError(400, 'Invalid data passed', null, res);
    }

    try {
        // Prepare members array
        const formattedMembers = members.map((memberId) => ({
            userId: memberId,
        }));

        const newChat = new Chat({
            groupId,
            members: formattedMembers,
        });

        const response = await newChat.save();
        ApiResponse(200, "Chat created successfully", response, res);
    } catch (error) {
        ApiError(500, error.message, null, res);
    }
};

// View all chats
exports.getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find()
            .populate('members.userId', 'name _id profilePicture')
            .populate('groupId', 'name _id');
        ApiResponse(200, 'Chats fetched successfully', chats, res);
    } catch (error) {
        ApiError(500, error.message, null, res);
    }
};

// View a single chat by ID
exports.getChatById = async (req, res) => {
    try {
        const { id: chatId } = req.params;

        const chat = await Chat.findById(chatId)
            .populate('members.userId', 'name _id profilePicture')
            .populate('groupId', 'name _id')
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: 'name _id profilePicture',
                },
            });

        if (!chat) {
            return ApiError(404, 'Chat not found', null, res);
        }

        ApiResponse(200, 'Chat fetched successfully', chat, res);
    } catch (error) {
        ApiError(500, error.message, null, res);
    }
};

// Send a message in a chat
exports.sendMessage = async (req, res) => {
    const { sender, content, chatId, type, attachments } = req.body;

    if (!content || !chatId) {
        return ApiError(400, 'Invalid data passed', null, res);
    }

    try {
        const newMessage = {
            sender,
            content,
            chatId,
            type,
            attachments,
        };

        // Create the message
        let message = await Message.create(newMessage);

        // Populate the message fields
        message = await Message.findById(message._id)
            .populate('sender', 'name _id')
            .populate({
                path: 'chatId',
                populate: [
                    {
                        path: 'members.userId',
                        select: 'name email',
                    },
                    {
                        path: 'groupId',
                        select: 'name',
                    },
                ],
            });

        // Update the chat with the new message
        await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: message._id },
                $set: { latestMessage: message._id },
            },
            { new: true, useFindAndModify: false }
        );

        ApiResponse(201, "Message sent successfully", message, res);
    } catch (error) {
        ApiError(500, error.message, null, res);
    }
};

// Update a chat by ID, replacing all members with new members
exports.updateChatById = async (req, res) => {
    const { members } = req.body;

    if (!Array.isArray(members)) {
        return ApiError(400, 'Invalid data passed', null, res);
    }

    try {
        const updatedMembers = members.map((member) => ({
            userId: member?._id || member,
        }));

        const updatedChat = await Chat.findByIdAndUpdate(
            req.params.id,
            { members: updatedMembers },
            { new: true, useFindAndModify: false }
        );

        if (!updatedChat) {
            return ApiError(404, 'Chat not found', null, res);
        }

        ApiResponse(200, 'Chat updated successfully', updatedChat, res);
    } catch (error) {
        ApiError(500, error.message, null, res);
    }
};

// Delete all messages in a specific chat
exports.deleteAllMessages = async (req, res) => {
    const { chatId } = req.body;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return ApiError(400, 'Chat not found', null, res);
        }

        chat.messages = [];
        chat.latestMessage = null;

        await chat.save();

        ApiResponse(200, 'All messages deleted successfully', chat, res);
    } catch (error) {
        ApiError(500, error.message, null, res);
    }
};

// Delete a chat by ID
exports.deleteChatById = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) {
            return ApiError(404, 'Chat not found', null, res);
        }
        ApiResponse(200, 'Chat deleted successfully', null, res);
    } catch (error) {
        ApiError(500, error.message, null, res);
    }
};

// Block a user from a chat
exports.blockUser = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return ApiError(400, 'Chat not found', null, res);
        }

        const memberIndex = chat.members.findIndex(member => member.userId.toString() === userId);

        if (memberIndex === -1) {
            return ApiError(400, 'User not found in this chat', null, res);
        }

        chat.members[memberIndex].leaveDate = new Date();

        await chat.save();

        ApiResponse(200, 'User blocked successfully', chat, res);
    } catch (error) {
        ApiError(500, error.message, null, res);
    }
};

// Unblock a user from a chat
exports.unblockUser = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return ApiError(400, 'Chat not found', null, res);
        }

        const memberIndex = chat.members.findIndex(member => member.userId.toString() === userId);

        if (memberIndex === -1) {
            return ApiError(400, 'User not found in this chat', null, res);
        }

        chat.members[memberIndex].leaveDate = null;

        await chat.save();

        ApiResponse(200, 'User unblocked successfully', chat, res);
    } catch (error) {
        ApiError(500, error.message, null, res);
    }
};