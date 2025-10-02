const express = require("express");
const router = express.Router();
const disputeController = require("../controllers/disputeController");
const auth = require("../middleware/auth");

// 📌 Get all disputes
// Admin → all disputes
// Customer → their disputes
// Worker → disputes against them
router.get(
  "/",
  auth(["admin", "customer", "worker"]),
  disputeController.getAllDisputes
);

// 📌 Get a single dispute
router.get(
  "/:id",
  auth(["admin", "customer", "worker"]),
  disputeController.getDisputeById
);

// 📌 Create a new dispute
// Only customer or worker involved in the booking can raise
router.post("/", auth(["customer", "worker"]), disputeController.createDispute);

// 📌 Update dispute
// Admin has full control, customer/worker can only add evidence or comments
router.put(
  "/:id",
  auth(["admin", "customer", "worker"]),
  disputeController.updateDispute
);

// 📌 Delete dispute
// Only admins can hard-delete disputes
router.delete("/:id", auth(["admin"]), disputeController.deleteDispute);

module.exports = router;
