const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");

const getAllUsersPhoneNumbers = async (req, res) => {
  try {
    const users = await User.find({}, "phoneNo name email");

    if (!users || users.length === 0) {
      return ApiResponse(404, "No users found", null, res);
    }

    return ApiResponse(200, "Users retrieved successfully", users, res);
  } catch (error) {
    console.error("Error fetching users:", error);
    return ApiResponse(500, "Internal server error", null, res);
  }
};

module.exports = {
  getAllUsersPhoneNumbers,
};
