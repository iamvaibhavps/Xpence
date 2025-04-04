const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createTransaction, getAllTransactions } = require("../controllers/transactionController");



router.post("/create", authMiddleware, createTransaction);

router.get("/all", authMiddleware, getAllTransactions);

router.get("/:id", authMiddleware, getTransaction);


module.exports = router;
