const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/get-all-users-phone", userController.getAllUsersPhoneNumbers);

module.exports = router;
