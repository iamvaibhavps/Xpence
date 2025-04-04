const Notification = require("../models/Notifications");

async function createNotification({ userId, title, description }) {
  try {
    const notification = {
      title,
      description,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userNotifications = await Notification.findOneAndUpdate(
      { userId },
      { $push: { notifications: notification } },
      { new: true, upsert: true }
    );

    return userNotifications;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

module.exports = {
  createNotification,
};
