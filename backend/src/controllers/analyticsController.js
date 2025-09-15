const User = require("../models/User");
const Worker = require("../models/Worker");
const Customer = require("../models/Customer");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Dispute = require("../models/Dispute");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      userCount,
      workerCount,
      customerCount,
      serviceCount,
      bookingCount,
      paymentCount,
      disputeCount,
    ] = await Promise.all([
      User.countDocuments(),
      Worker.countDocuments(),
      Customer.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Payment.countDocuments(),
      Dispute.countDocuments(),
    ]);
    res.json({
      users: userCount,
      workers: workerCount,
      customers: customerCount,
      services: serviceCount,
      bookings: bookingCount,
      payments: paymentCount,
      disputes: disputeCount,
    });
  } catch (err) {
    next(err);
  }
};
