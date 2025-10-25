const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");

// ---------------- Admin Routes ---------------- //

// Admin: Get all payments (with population)
router.get("/admin", auth("admin"), paymentController.getAllPaymentsAdmin);

// Admin: Delete a payment
router.delete("/:id", auth("admin"), paymentController.deletePayment);

// Admin: Update payment
router.put(
  "/:bookingId",
  auth(["worker", "admin"]),
  paymentController.updatePayment
);

// ---------------- Common Routes ---------------- //

// Get all payments (role-based: customer sees theirs, worker sees theirs, admin sees all)
router.get(
  "/",
  auth(["customer", "worker", "admin"]),
  paymentController.getAllPayments
);

// Get a single payment by ID (role-based access)
router.get(
  "/:id",
  auth(["customer", "worker", "admin"]),
  paymentController.getPaymentById
);

// Create a payment (customers initiate, admin can also create manually if needed)
router.post(
  "/:bookingId",
  auth(["customer", "worker", "admin"]),
  paymentController.createPayment
);

module.exports = router;
