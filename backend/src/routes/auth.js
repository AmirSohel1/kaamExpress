const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// ===============================
// 📌 Public Routes (no auth)
// ===============================
router.post("/register", authController.register); // Create account
router.post("/login", authController.login); // Login & get token
router.post("/forgot-password", authController.forgotPassword); // Request reset link
router.post("/reset-password", authController.resetPassword); // Reset password

// ===============================
// 🔑 Authenticated User Routes
// ===============================
router.get("/me", auth(["customer", "admin", "worker"]), authController.me); // Get own profile
router.get("/verify-token", (req, res) => {
  // Verify token validity
  res.json({ valid: true });
});
router.put("/update-profile", auth(), authController.updateProfile); // Update profile
router.put("/update-password", auth(), authController.updatePassword); // Update password
router.delete("/delete-account", auth(), authController.deleteAccount); // Delete own account

// ===============================
// 🛠️ Admin-Only Routes
// ===============================

router.put(
  "/admin-update-user/:id",
  auth(["admin"]),
  authController.adminUpdateUser
); // Update user by ID
router.delete(
  "/admin-delete-user/:id",
  auth(["admin"]),
  authController.adminDeleteUser
); // Delete user by ID
router.get(
  "/admin-get-all-users",
  auth(["admin"]),
  authController.adminGetAllUsers
); // List all users
router.get(
  "/admin-get-user-by-id/:id",
  auth(["admin"]),
  authController.adminGetUserById
); // Get user by ID
router.put(
  "/admin-deactivate-user/:id",
  auth(["admin"]),
  authController.adminDeactivateUser
); // Deactivate user
router.put(
  "/admin-reactivate-user/:id",
  auth(["admin"]),
  authController.adminReactivateUser
); // Reactivate user
router.get(
  "/admin-search-users/:query",
  auth(["admin"]),
  authController.adminSearchUsers
); // Search users

router.put(
  "/updatePasswordAll",
  auth(["admin"]),
  authController.adminUpdateAllUserPasswords
); // one-time use

module.exports = router;
