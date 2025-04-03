const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");

const Transaction = require("../models/Transaction");

const createTransaction = async (req, res) => {

    try {

        const { title, amount, category, date, description, group } = req.body;

        if (!title || !amount || !category || !date || !description || !group) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const transaction = new Transaction({
            user: req.user._id,
            title,
            amount,
            category,
            date,
            description,
            group,
        });

        await transaction.save();

        return ApiResponse(201, "Transaction created successfully", transaction, res);

    }
    catch (error) {
        console.error("Error creating transaction:", error);
        return ApiResponse(500, "Internal server error", null, res);
    }
};

const getTransaction = async (req, res) => {

    try {
        const { transactionId } = req.params;

        const transaction = await Transaction.findById(transactionId).populate("user", "name email phoneNo").populate("group", "name");

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        return ApiResponse(200, "Transaction retrieved successfully", transaction, res);
    }
    catch (error) {
        console.error("Error retrieving transaction:", error);
        return ApiResponse(500, "Internal server error", null, res);
    }
}

const getAllTransactions = async (req, res) => {

    try {
        const transactions = await Transaction.find({ user: req.user._id }).populate("user", "name email phoneNo").populate("group", "name");

        return ApiResponse(200, "Transactions retrieved successfully", transactions, res);
    }
    catch (error) {
        console.error("Error retrieving transactions:", error);
        return ApiResponse(500, "Internal server error", null, res);
    }
};

// TODO: to be implemented
const addBulkTransactions = async (req, res) => {

    try {
        const transactions = req.body.transactions;
        
        if (!Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({ error: "Invalid transactions data" });
        }

        const bulkOps = transactions.map(transaction => ({
            insertOne: {
                document: {
                    user: req.user._id,
                    ...transaction,
                },
            },
        }));

        await Transaction.bulkWrite(bulkOps);

        return ApiResponse(201, "Bulk transactions added successfully", null, res);
    }
    catch (error) {
        console.error("Error adding bulk transactions:", error);
        return ApiResponse(500, "Internal server error", null, res);
    }

};

module.exports = {
    createTransaction,
    getTransaction,
    getAllTransactions,
    addBulkTransactions,
};