const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

// Get all notifications for logged-in user
router.get(
  "/",
  auth(["customer", "worker", "admin"]),
  notificationController.getUserNotifications
);

// Mark notifications as read
router.put(
  "/read",
  auth(["customer", "worker", "admin"]),
  notificationController.markNotificationsRead
);

// Delete notifications
router.delete(
  "/",
  auth(["customer", "worker", "admin"]),
  notificationController.deleteNotifications
);

module.exports = router;
