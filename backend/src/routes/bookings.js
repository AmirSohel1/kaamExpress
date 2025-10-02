const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");

// 📌 Get all bookings
// Admin → all
// Worker → their bookings
// Customer → their bookings
router.get(
  "/",
  auth(["admin", "worker", "customer"]),
  bookingController.getAllBookings
);

// 📌 Get single booking
router.get(
  "/:id",
  auth(["admin", "worker", "customer"]),
  bookingController.getBookingById
);

// 📌 Create booking
// Only customer (and admin on behalf) can create
router.post("/", auth(["admin", "customer"]), bookingController.createBooking);

// 📌 Update booking
// Role-based updates (customer = reschedule, worker = accept/reject/complete, admin = full)
router.put(
  "/:id",
  auth(["admin", "worker", "customer"]),
  bookingController.updateBooking
);

// 📌 Delete booking
// Only admin can hard delete
router.delete("/:id", auth(["admin"]), bookingController.deleteBooking);

module.exports = router;
