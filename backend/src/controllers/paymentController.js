const Payment = require("../models/Payment");

exports.getAllPaymentsAdmin = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("booking")
      .populate("customer")
      .populate("worker");
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

exports.getAllPayments = async (req, res, next) => {
  try {
    const userId = req.user.id; // assuming user is added to req via auth middleware
    const userRole = req.user.role; // e.g., 'customer' or 'worker'

    let filter = {};

    if (userRole === "customer") {
      filter.customer = userId;
    } else if (userRole === "worker") {
      filter.worker = userId;
    }

    const payments = await Payment.find(filter)
      .populate("booking")
      .populate("customer")
      .populate("worker");

    res.json(payments);
  } catch (err) {
    next(err);
  }
};

exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("booking")
      .populate("customer")
      .populate("worker");
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("booking")
      .populate("customer")
      .populate("worker");
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json({ message: "Payment deleted" });
  } catch (err) {
    next(err);
  }
};
