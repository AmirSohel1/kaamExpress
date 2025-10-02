const Notification = require("../models/Notification");

class NotificationService {
  // Send a new notification
  static async send({ sender, receiver, type, title, message, metadata }) {
    return await Notification.create({
      sender,
      receiver,
      type,
      title,
      message,
      metadata,
    });
  }

  // Get notifications for a user
  static async getForUser(userId, role) {
    const notifications = await Notification.find({
      "receiver.id": userId,
      "receiver.role": role,
    })
      .sort({ createdAt: -1 })
      .limit(50); // add pagination later

    // Normalize for frontend
    return notifications.map((n) => ({
      id: n._id.toString(), // convert Mongo _id to string
      message: n.message,
      read: n.status === "read", // convert status to boolean
      time: n.createdAt,
      type: n.type,
    }));
  }

  // Mark notifications as read
  static async markAsRead(userId, role, ids) {
    return await Notification.updateMany(
      { "receiver.id": userId, "receiver.role": role, _id: { $in: ids } },
      { $set: { status: "read" } }
    );
  }

  // Delete notifications
  static async delete(userId, role, ids) {
    return await Notification.deleteMany({
      "receiver.id": userId,
      "receiver.role": role,
      _id: { $in: ids },
    });
  }
}

module.exports = NotificationService;
