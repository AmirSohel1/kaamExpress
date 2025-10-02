const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      id: { type: mongoose.Schema.Types.ObjectId, required: false },
      role: {
        type: String,
        enum: ["customer", "worker", "admin"],
        required: true,
      },
    },
    receiver: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      role: {
        type: String,
        enum: ["customer", "worker", "admin"],
        required: true,
      },
    },
    type: {
      type: String,
      enum: [
        "job",
        "rating",
        "system",
        "payment",
        "promo",
        "alert",
        "reminder",
        "other",
      ],
      required: true,
    },
    title: { type: String, required: true }, // short title (UI friendly)
    message: { type: String, required: true }, // detailed message
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
    },
    metadata: {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
      paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
      extra: { type: Object }, // flexible, store additional info
    },
  },
  { timestamps: true }
);

// Index for fast lookup
NotificationSchema.index({ "receiver.id": 1, "receiver.role": 1, status: 1 });

module.exports = mongoose.model("Notification", NotificationSchema);
