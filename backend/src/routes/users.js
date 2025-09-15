const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Admin only
router.get("/", auth("admin"), userController.getAllUsers);
router.get(
  "/:id",
  auth(["admin", "worker", "customer"]),
  userController.getUserById
);
router.put(
  "/:id",
  auth(["admin", "worker", "customer"]),
  userController.updateUser
);
router.delete("/:id", auth("admin"), userController.deleteUser);

module.exports = router;
