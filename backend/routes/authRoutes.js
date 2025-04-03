const express = require("express");
const {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/authController");

const router = express.Router();

router.post("/sign-up", registerController);

router.post("/sign-in", loginController);

router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

module.exports = router;
