const express = require("express");

const router = express.Router();
const {
  createTransactionWithSplit,
  updatePaymentStatus,
  getAllSplits,
  getSplitById,
} = require("../controllers/splitController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, createTransactionWithSplit);
router.put("/update-payment-status", authMiddleware, updatePaymentStatus);
router.get("/all", authMiddleware, getAllSplits);
router.get("/:splitId", authMiddleware, getSplitById);

module.exports = router;
