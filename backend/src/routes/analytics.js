const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const auth = require("../middleware/auth");

// Dashboard stats (admin only)
router.get("/dashboard", auth("admin"), analyticsController.getDashboardStats);

module.exports = router;
