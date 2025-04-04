const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const ApiResponse = require("../utils/ApiResponse");
const { createNotification } = require("../utils/Notification");

const convertToINR = (amount, currency) => {
  const exchangeRates = {
    USD: 85.32, // 1 USD = 85.32 INR
    EUR: 92.44, // 1 EUR = 92.44 INR
    GBP: 110.42, // 1 GBP = 110.42 INR
    JPY: 0.57, // 1 JPY = 0.57 INR
    AUD: 53.34, // 1 AUD = 53.34 INR
    INR: 1, // 1 INR = 1 INR
  };

  const upperCaseCurrency = currency ? currency.toUpperCase() : null;
  // console.log("Currency:", upperCaseCurrency);

  if (!amount || !exchangeRates[upperCaseCurrency]) {
    throw new Error("Invalid input or exchange rate not available.");
  }

  return (amount * exchangeRates[upperCaseCurrency]).toFixed(2);
};

const createTransaction = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      date,
      description,
      group,
      paymentType,
      unit,
    } = req.body;

    if (!title || !amount || !category || !date || !group || !paymentType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let convertedAmount;
    try {
      convertedAmount = unit ? Number(convertToINR(amount, unit)) : amount;
    } catch (error) {
      return ApiResponse(400, error.message, null, res);
    }

    const transaction = new Transaction({
      user: req.user.id,
      title,
      amount: convertedAmount,
      category,
      date,
      description: description || "",
      group,
      paymentType,
      unit: unit ? unit.toUpperCase() : "",
    });

    await transaction.save();

    await createNotification({
      userId: req.user._id,
      title: "Transaction Created",
      description: `Transaction "${title}" of amount ${convertedAmount} INR has been created.`,
    });

    return ApiResponse(
      201,
      "Transaction created successfully",
      transaction,
      res
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const getTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId)
      .populate("user", "name email phoneNo")
      .populate("group", "name");

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return ApiResponse(
      200,
      "Transaction retrieved successfully",
      transaction,
      res
    );
  } catch (error) {
    console.error("Error retrieving transaction:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    return ApiResponse(
      200,
      "Transactions retrieved successfully",
      transactions,
      res
    );
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const verifyDuplicates = async (req, res) => {
  try {
    const { title, amount, date, user } = req.body;

    if (!title || !amount || !date || !user) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for duplicate check",
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const duplicates = await Transaction.find({
      user: user,
      title: title,
      amount: amount,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    if (duplicates.length > 0) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: "Duplicate transactions found!",
        duplicates: duplicates.map((d) => ({
          id: d._id,
          title: d.title,
          amount: d.amount,
          date: d.date,
          category: d.category,
          paymentType: d.paymentType,
        })),
      });
    }

    return res.status(200).json({
      success: true,
      isDuplicate: false,
      message: "No duplicate transactions found",
    });
  } catch (error) {
    console.error("Error checking for duplicates:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking for duplicates",
      error: error.message,
    });
  }
};

// TODO: to be implemented
const addBulkTransactions = async (req, res) => {
  try {
    const transactions = req.body.transactions;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ error: "Invalid transactions data" });
    }

    const bulkOps = transactions.map((transaction) => ({
      insertOne: {
        document: {
          user: req.user._id,
          ...transaction,
        },
      },
    }));

    await Transaction.bulkWrite(bulkOps);

    return ApiResponse(201, "Bulk transactions added successfully", null, res);
  } catch (error) {
    console.error("Error adding bulk transactions:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

module.exports = {
  createTransaction,
  getTransaction,
  getAllTransactions,
  addBulkTransactions,
  verifyDuplicates,
};
