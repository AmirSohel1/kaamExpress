const NotificationService = require("../services/notificationService");

/**
 * Get all notifications for logged-in user
 */
exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getForUser(
      req.user.id,
      req.user.role
    );

    // The service already normalizes id and read
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

/**
 * Mark selected notifications as read
 * Expects: { ids: [id1, id2, ...] }
 */
exports.markNotificationsRead = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid notification IDs" });
    }

    await NotificationService.markAsRead(req.user.id, req.user.role, ids);

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete selected notifications
 * Expects: { ids: [id1, id2, ...] }
 */
exports.deleteNotifications = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid notification IDs" });
    }

    await NotificationService.delete(req.user.id, req.user.role, ids);

    res.json({ message: "Notifications deleted" });
  } catch (err) {
    next(err);
  }
};
