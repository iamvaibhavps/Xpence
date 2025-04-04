const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const groupController = require("../controllers/groupController");

router.post("/create", authMiddleware, groupController.createGroup);

router.put("/update/:groupId", authMiddleware, groupController.updateGroup);

router.get("/all", authMiddleware, groupController.getAllGroups);

router.get(
  "/:groupId/splits",
  authMiddleware,
  groupController.findAllSplitsOfGroup
);

router.get(
  "/:groupId/transactions",
  authMiddleware,
  groupController.findAllTransactionsofGroup
);

router.delete("/:groupId/delete", authMiddleware, groupController.deleteGroup);

module.exports = router;
