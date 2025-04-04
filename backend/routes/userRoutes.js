const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/get-all-users-phone", userController.getAllUsersPhoneNumbers);

const { getUserPerformance } = require("../controllers/userController");

router.get("/get-dashboard-info/:id", authMiddleware, getUserPerformance);

module.exports = router;
