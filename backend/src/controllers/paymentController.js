const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const NotificationService = require("../services/notificationService");

// 🔹 Admin: Get all payments
exports.getAllPaymentsAdmin = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("booking", "status date service")
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// 🔹 Customer/Worker: Get own payments
exports.getAllPayments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let filter = {};
    if (userRole === "customer") filter.customer = userId;
    else if (userRole === "worker") filter.worker = userId;

    const payments = await Payment.find(filter)
      .populate("booking", "status date service")
      .populate("customer", "name email")
      .populate("worker", "name email");

    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// 🔹 Get single payment (role-based access)
exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("booking", "status date service")
      .populate("customer", "name email")
      .populate("worker", "name email");

    if (!payment) return res.status(404).json({ error: "Payment not found" });

    const user = req.user;
    if (user.role === "customer" && payment.customer._id.toString() !== user.id)
      return res.status(403).json({ error: "Access denied" });
    if (user.role === "worker" && payment.worker._id.toString() !== user.id)
      return res.status(403).json({ error: "Access denied" });

    console.log("Payment fetched:", payment);
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

// 🔹 Create Payment (customer triggers payment)
exports.createPayment = async (req, res, next) => {
  try {
    const user = req.user;
    const booking = req.params.bookingId;
    const { amount, method, transactionId } = req.body;

    if (!booking || !amount || !method) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch booking to auto-assign worker/customer
    const bookingData = await Booking.findById(booking);
    if (!bookingData)
      return res.status(404).json({ error: "Booking not found" });
    // Authorization: allow only customer or worker assigned to booking
    const userId = user.id;
    console.log("Payment Auth Debug:", {
      userId,
      bookingCustomer: String(bookingData.customer),
      bookingWorker: String(bookingData.worker),
    });
    if (
      userId !== String(bookingData.customer) &&
      userId !== String(bookingData.worker)
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const payment = await Payment.create({
      booking,
      amount,
      method,
      transactionId: transactionId || null,
      customer: bookingData.customer,
      worker: bookingData.worker,
      createdBy: user.id,
    });

    // ----------------- 🔔 Notifications ----------------- //
    try {
      // Notify worker
      await NotificationService.send({
        sender: { id: user.id, role: user.role },
        receiver: { id: bookingData.worker, role: "worker" },
        type: "payment",
        title: "Payment Received",
        message: `You have received a payment of ₹${amount} for booking #${booking}.`,
        metadata: { paymentId: payment._id, bookingId: booking },
      });

      // Notify customer
      await NotificationService.send({
        sender: { id: user.id, role: user.role },
        receiver: { id: bookingData.customer, role: "customer" },
        type: "payment",
        title: "Payment Successful",
        message: `Your payment of ₹${amount} for booking #${booking} was successful.`,
        metadata: { paymentId: payment._id, bookingId: booking },
      });
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr);
    }

    await Booking.findByIdAndUpdate(booking, {
      isPaid: true,
    });
    // console.log("Updated Booking isPaid:", updateIsPaid);

    res.status(201).json({ message: "Payment created", payment });
  } catch (err) {
    next(err);
  }
};

// 🔹 Update Payment (Admin only)
exports.updatePayment = async (req, res, next) => {
  try {
    const user = req.user;

    // Only allow admin or worker
    if (user.role !== "admin" && user.role !== "worker") {
      return res.status(403).json({ error: "Access denied" });
    }

    const bookingId = req.params.bookingId;

    // Find payment linked to the booking
    const payment = await Payment.findOne({ booking: bookingId });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Update fields
    Object.assign(payment, req.body);
    payment.updatedBy = user.id;
    await payment.save();

    // Populate references
    const populatedPayment = await payment.populate([
      { path: "booking", select: "status date service" },
      { path: "customer", select: "name email" },
      { path: "worker", select: "name email" },
    ]);

    // Update booking to mark as paid
    await Booking.findByIdAndUpdate(bookingId, { isPaid: true });

    res.json({ message: "Payment updated", payment: populatedPayment });
  } catch (err) {
    next(err);
  }
};

// 🔹 Delete Payment (Admin only)
exports.deletePayment = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Access denied" });

    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    res.json({ message: "Payment deleted" });
  } catch (err) {
    next(err);
  }
};
