const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String },
    status: {
      type: String,
      enum: ["Pending", "In-progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    price: { type: Number },
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByModel: {
      type: String,
      enum: ["Customer", "Worker", "Admin"],
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedByModel: {
      type: String,
      enum: ["customer", "worker", "admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
