const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    address: { type: String },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
    reviews: [
      {
        worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
