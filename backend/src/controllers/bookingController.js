const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const NotificationService = require("../services/notificationService");
const User = require("../models/User");
const Service = require("../models/Service");

// =============================
// 📌 Get All Bookings (role-based)
// =============================
exports.getAllBookings = async (req, res, next) => {
  try {
    const user = req.user;
    let filter = {};

    if (user.role === "worker") filter.worker = user.id;
    else if (user.role === "customer") filter.customer = user.id;

    const bookings = await Booking.find(filter)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price")
      .populate("payment")
      .populate("dispute")
      .sort({ createdAt: -1 });

    res.json({ count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

// =============================
// 📌 Get Booking by ID
// =============================
exports.getBookingById = async (req, res, next) => {
  try {
    const user = req.user;
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price")
      .populate("payment")
      .populate("dispute");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Authorization check
    if (
      (user.role === "customer" &&
        booking.customer._id.toString() !== user.id) ||
      (user.role === "worker" && booking.worker._id.toString() !== user.id)
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// =============================
// 📌 Create Booking
// =============================
exports.createBooking = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const {
      worker,
      service,
      date,
      time,
      duration,
      location,
      notes,
      price,
      billing,
      discount,
      tax,
    } = req.body;

    if (!worker || !service || !date || !location)
      return res
        .status(400)
        .json({ message: "Missing required booking fields" });

    // Check service
    const serviceData = await Service.findById(service);
    if (!serviceData)
      return res.status(400).json({ message: "Invalid service selected" });

    // 🔒 Check if worker is already booked at the same time
    const existingBooking = await Booking.findOne({
      worker,
      date: new Date(date),
      time,
      status: { $in: ["Pending", "Accepted", "In-progress"] },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Worker is already booked at this time" });
    }

    // Booking data
    const bookingData = {
      worker,
      service,
      serviceSnapshot: {
        name: serviceData.name,
        category: serviceData.category,
        description: serviceData.description,
        basePrice: serviceData.price,
        duration: duration || serviceData.duration || 0,
      },
      date,
      time: time || "",
      duration: duration || serviceData.duration || 0,
      customer: user.id,
      status: "Pending",
      location: {
        ...location,
        coordinates: location.coordinates?.coordinates ||
          location.coordinates || [0, 0],
        type: "Point",
      },
      customerNotes: notes || "",
      price: price || serviceData.price,
      discount: discount || 0,
      tax: tax || 0,
      finalAmount: price || serviceData.price,
      billing: {
        invoiceNumber: "",
        receiptUrl: "",
        billingNotes: billing || "",
      },
      createdBy: user.id,
      createdByModel: user.role || "customer",
    };

    let booking = await Booking.create(bookingData);

    // Initial status history
    booking.statusHistory.push({
      status: "Pending",
      changedBy: user.id,
      reason: "New booking created",
    });
    await booking.save();

    // Notify worker
    try {
      await NotificationService.send({
        sender: { id: user.id, role: user.role },
        receiver: { id: worker, role: "worker" },
        type: "job",
        title: "New Booking Request",
        message: `You have received a new booking request from ${
          user.name || "a customer"
        }.`,
        metadata: { bookingId: booking._id },
      });
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr);
    }

    booking = await booking.populate([
      { path: "customer", select: "name email phone" },
      { path: "worker", select: "name email phone" },
      { path: "service", select: "name category price" },
    ]);

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err) {
    // Handle unique index error
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Worker already has a booking at this time" });
    }
    next(err);
  }
};

// =============================
// 📌 Update Booking
// =============================
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
    if (user.role === "customer")
      allowedFields = ["location", "date", "time", "customerNotes"];
    if (user.role === "worker")
      allowedFields = ["status", "workerNotes", "price", "finalAmount"];
    if (user.role === "admin") allowedFields = Object.keys(req.body);

    // Update only allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) booking[field] = req.body[field];
    });

    // Track status changes
    if (req.body.status && req.body.status !== booking.status) {
      booking.statusHistory.push({
        status: req.body.status,
        changedBy: user.id,
        reason: req.body.reason || "",
      });
      booking.status = req.body.status;
    }

    booking.updatedBy = user.id;
    booking.updatedByModel = user.role;
    await booking.save();

    // Handle status-specific actions
    if (req.body.status) {
      let title, message, type;
      type = "job";

      if (req.body.status === "Accepted") {
        title = "Booking Accepted";
        message = "The worker has accepted your booking request.";
      } else if (req.body.status === "Rejected") {
        title = "Booking Rejected";
        message = "The worker has rejected your booking request.";
      } else if (req.body.status === "In-progress") {
        title = "Booking In-progress";
        message = "The worker has started the job.";
      } else if (req.body.status === "Completed") {
        title = "Work Completed";
        message =
          "The job is marked as completed. Please proceed with payment.";
        type = "payment";

        // Auto-create payment if not paid
        if (!booking.isPaid) {
          await Payment.create({
            booking: booking._id,
            customer: booking.customer,
            worker: booking.worker,
            amount: booking.finalAmount || booking.price || 0,
            status: "Pending",
            method: booking.billing?.method || "UPI",
            createdBy: user.id,
            updatedBy: user.id,
          });
        }
      } else if (req.body.status === "Cancelled") {
        title = "Booking Cancelled";
        message = "The booking has been cancelled.";
      }

      // Notify customer
      if (user.role === "worker") {
        await NotificationService.send({
          sender: { id: user.id, role: "worker" },
          receiver: { id: booking.customer, role: "customer" },
          type,
          title,
          message,
          metadata: { bookingId: booking._id },
        });
      }
    }

    booking = await booking.populate([
      { path: "customer", select: "name email phone" },
      { path: "worker", select: "name email phone" },
      { path: "service", select: "name category price" },
      { path: "payment" },
    ]);

    res.json({ message: "Booking updated successfully", booking });
  } catch (err) {
    next(err);
  }
};

// =============================
// 📌 Delete Booking
// =============================
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    next(err);
  }
};
