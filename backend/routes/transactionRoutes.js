const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, transactionController.createTransaction);
router.get(
  "/get-single/:transactionId",
  authMiddleware,
  transactionController.getTransaction
);
router.get("/all", authMiddleware, transactionController.getAllTransactions);
router.post("/bulk", transactionController.addBulkTransactions);

module.exports = router;
