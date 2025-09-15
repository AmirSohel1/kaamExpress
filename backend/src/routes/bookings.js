const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");

router.get(
  "/",
  auth(["admin", "worker", "customer"]),
  bookingController.getAllBookings
);
router.get(
  "/:id",
  auth(["admin", "worker", "customer"]),
  bookingController.getBookingById
);

router.post("/", auth(["admin", "customer"]), bookingController.createBooking);

router.put(
  "/:id",
  auth(["admin", "worker", "customer"]),
  bookingController.updateBooking
);

router.delete("/:id", auth("admin"), bookingController.deleteBooking);
module.exports = router;
