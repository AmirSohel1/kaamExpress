const Booking = require("../models/Booking");
const User = require("../models/User");

exports.getAllBookings = async (req, res, next) => {
  try {
    const user = req.user;

    let filter = {};
    if (user.role === "worker") filter.worker = user.id;
    else if (user.role === "customer") filter.customer = user.id;

    const bookings = await Booking.find(filter)
      .populate("customer")
      .populate("worker")
      .populate("service");

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const user = req.user;
    const booking = await Booking.findById(req.params.id)
      .populate("customer")
      .populate("worker")
      .populate("service");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Authorization check
    if (
      (user.role === "customer" &&
        booking.customer._id.toString() !== user._id) ||
      (user.role === "worker" && booking.worker._id.toString() !== user._id)
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};
exports.createBooking = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);
    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized or invalid user" });
    }

    const { worker, service, date, location, notes, price, billing } = req.body;
    if (!worker || !service || !date || !location) {
      return res
        .status(400)
        .json({ message: "Missing required booking fields" });
    }

    const bookingData = {
      worker,
      service,
      date,
      customer: user.id,
      status: "Pending",
      location,
      notes: notes || "",
      price: price || 0,
      billing: billing || "",
      createdBy: user.id,
      createdByModel: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    };

    const booking = await Booking.create(bookingData);

    // Create notification for customer
    try {
      const NotificationController = require("./notificationController");
      await NotificationController.createNotification({
        user: user.id,
        message: `Your booking for service has been placed and is pending confirmation.`,
        type: "booking",
      });
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr);
    }

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Booking creation failed", error: err.message });
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const user = req.user;

    let booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Authorization
    if (user.role === "customer" && booking.customer.toString() !== user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    if (user.role === "worker" && booking.worker.toString() !== user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Role-based allowed fields
    let allowedFields = [];
    if (user.role === "customer") {
      allowedFields = ["location", "date", "time", "notes"];
    } else if (user.role === "worker") {
      allowedFields = ["status", "notes"];
    } else if (user.role === "admin") {
      allowedFields = Object.keys(req.body); // admin can edit all
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        booking[field] = req.body[field];
      }
    });

    booking.updatedBy = user.id;
    booking.updatedByModel = user.role;

    await booking.save();

    // ✅ Mongoose 6+ populate syntax
    booking = await booking.populate([
      { path: "customer" },
      { path: "worker" },
      { path: "service" },
    ]);

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    next(err);
  }
};
