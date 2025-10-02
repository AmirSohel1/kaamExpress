const Booking = require("../models/Booking");
const Worker = require("../models/Worker");
const User = require("../models/User");

const createReview = async (req, res, next) => {
  try {
    const user = req.user;
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status !== "Completed") {
      return res
        .status(400)
        .json({ error: "Cannot review an incomplete booking" });
    }

    if (booking.customer.toString() !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (booking.review && booking.review.rating) {
      return res.status(400).json({ error: "Review already exists" });
    }

    booking.review = { rating, comment };
    await booking.save();

    res.status(201).json({ message: "Review created", review: booking.review });
  } catch (err) {
    next(err);
  }
};

const getReviewsForWorker = async (req, res, next) => {
  try {
    const workerId = req.params.workerId;
    const bookings = await Booking.find({
      worker: workerId,
      "review.rating": { $exists: true },
    }).populate("customer", "name email");
    const reviews = bookings.map((b) => ({
      bookingId: b._id,
      customer: b.customer, // Assuming customer has name and email fields
      rating: b.review.rating,
      comment: b.review.comment,
    }));
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const user = req.user;
    let id = null;
    if (user.role === "customer") {
      id = user.id; // Assuming user.id is the worker's ID
    } else if (user.role === "worker") {
      const worker = await Worker.findOne({ user: user.id });
      if (!worker) {
        return res.status(404).json({ error: "Worker not found" });
      }
      // console.log(worker);
      id = worker.user; // Assuming worker.id is the worker's ID
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }

    let bookings;
    console.log("User role:", user.role, "  ID:", id);
    if (user.role === "worker") {
      bookings = await Booking.find({
        worker: id,
        status: "Completed",
      }).populate("customer", "name email");
    } else if (user.role === "customer") {
      bookings = await Booking.find({
        customer: id,
        status: "Completed",
      }).populate("worker", "name email");
    }
    // console.log(bookings);

    const reviews = bookings.map((b) => ({
      bookingId: b._id,
      customer: b.customer, // Assuming customer has name and email fields
      worker: b.worker, // Assuming worker has name and email fields
      rating: b.review.rating,
      comment: b.review.comment,
    }));
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  getReviewsForWorker,
  getAllReviews,
};
