const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/passwords");
const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const { sendEmailHtml } = require("../utils/services/emailService");
const Group = require("../models/Group");
const UserPerformance = require("../models/UserPerformance");
const { getCurrentFinancialYear, getPreviousFinancialYear } = require("../functions/calculations");

const currFinYear = getCurrentFinancialYear();
const prevFinYear = getPreviousFinancialYear();

const registerController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, phoneNo, password, role } = req.body;

    if (!name || !email || !phoneNo || !password || !role) {
      await session.abortTransaction();
      session.endSession();
      return ApiResponse(400, "All fields are required", null, res);
    }

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return ApiResponse(400, "Email is already registered", null, res);
    }

    const hashedPassword = await hashPassword(password);
    console.log("Hashed Password: ", hashedPassword);

    const newUser = new User({
      name,
      email,
      phoneNo,
      role,
      password: hashedPassword,
    });

    
    await newUser.save({ session });

    // Create the userPerformance document
    const userP = new UserPerformance({
      userId: newUser._id,
    });

    await userP.save({ session });
    
    // add the current financial year to the userPerformance document
    await userP.addYearIfMissing(currFinYear);
    await userP.addYearIfMissing(prevFinYear);

    // create a group named 'Personal' for the user
    const group = new Group({
      name: "Personal",
      members: [newUser._id],
      description: "Personal group for individual transactions",
    });

    await group.save({ session });

    await session.commitTransaction();
    session.endSession();

    return ApiResponse(
      201,
      "User registered successfully",
      { id: newUser._id },
      res
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during registration:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      return ApiError(
        400,
        "User not found. Please register if you don’t have an account.",
        null,
        res
      );
    }

    const isMatch = await comparePassword(password, existingUser.password);
    if (!isMatch) {
      return ApiError(
        400,
        "Incorrect password. Please try again or reset your password if you’ve forgotten it.",
        null,
        res
      );
    }

    const token = await generateToken(existingUser);

    const personalGroup = await Group.findOne({
      name: "Personal",
      members: existingUser._id,
    }).session(session);
    if (!personalGroup) {
      const newGroup = new Group({
        name: "Personal",
        members: [existingUser._id],
        description: "Personal group for individual transactions",
      });

      await newGroup.save({ session });
    };


    const user = {
      name: existingUser.name,
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      phoneNo: existingUser.phoneNo,
      groupId: personalGroup ? personalGroup._id : null,
      token,
    };

    await session.commitTransaction();
    session.endSession();
    return ApiResponse(200, "Login successful!", (data = user), res);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Server Error: ", error.message);
    return ApiError(500, error.message, error, res);
  }
};

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!email) {
      await session.abortTransaction();
      session.endSession();
      return ApiResponse(400, "Email is required", null, res);
    }

    const user = await User.findOne({ email }).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return ApiResponse(404, "User not found with this email", null, res);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 3600000; // 1 hour validity

    // Save OTP in user record
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = otpExpiry;
    await user.save({ session });

    // Create HTML content for password reset email with OTP
    const emailSubject = "Password Reset OTP";
    const emailHtml = `
          <h1>Password Reset Request</h1>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your account.</p>
          <p>Your OTP for password reset is:</p>
          <h2 style="background-color: #f2f2f2; padding: 10px; font-size: 24px; text-align: center; letter-spacing: 5px;">${otp}</h2>
          <p>This OTP will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
      `;

    await sendEmailHtml(email, emailSubject, emailHtml);

    await session.commitTransaction();
    session.endSession();

    return ApiResponse(200, "Password reset OTP sent to your email", null, res);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during forgot password:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

const resetPasswordController = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!email || !otp || !newPassword) {
      await session.abortTransaction();
      session.endSession();
      return ApiResponse(
        400,
        "Email, OTP and new password are required",
        null,
        res
      );
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    }).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return ApiResponse(400, "Invalid or expired OTP", null, res);
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    // Clear the OTP fields after successful verification
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return ApiResponse(200, "Password has been reset successfully", null, res);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during password reset:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
};
