const Notification = require("../models/Notifications");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

exports.readNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notificationId = req.params.id;

    if (!notificationId) {
      return ApiError(400, "Notification ID is required", null, res);
    }

    const result = await Notification.findOneAndUpdate(
      {
        userId,
        "notifications._id": notificationId,
      },
      {
        $set: {
          "notifications.$.isRead": true,
          "notifications.$.updatedAt": Date.now(),
        },
      },
      { new: true }
    );

    if (!result) {
      return ApiError(404, "Notification not found", null, res);
    }

    return ApiResponse(200, "Notification marked as read", result, res);
  } catch (error) {
    return ApiError(500, "Error updating notification", error.message, res);
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log(userId);
    const userNotifications = await Notification.findOne({ userId }).select(
      "notifications"
    );
    console.log(userNotifications);
    const notifications = userNotifications?.notifications || [];

    return ApiResponse(
      200,
      "All notifications retrieved successfully",
      notifications,
      res
    );
  } catch (error) {
    console.log(error);
    return ApiError(
      500,
      "Error retrieving all notifications",
      error.message,
      res
    );
  }
};
