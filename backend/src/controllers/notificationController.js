const Notification = require("../models/Notification");
const User = require("../models/User");

// Get all notifications for a user (customer or worker)
exports.getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

// Mark notifications as read
exports.markNotificationsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany(
      { user: userId, _id: { $in: req.body.ids } },
      { $set: { read: true } }
    );
    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

// Delete notifications
exports.deleteNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Notification.deleteMany({ user: userId, _id: { $in: req.body.ids } });
    res.json({ message: "Notifications deleted" });
  } catch (err) {
    next(err);
  }
};

// Utility: Create notification for a user
exports.createNotification = async ({ user, message, type }) => {
  return Notification.create({ user, message, type });
};
