const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    // 🔗 Linked Users
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

    // 🛠️ Service Details
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceSnapshot: {
      name: { type: String, trim: true, default: "" },
      category: { type: String, trim: true, default: "" },
      description: { type: String, trim: true, default: "" },
      basePrice: { type: Number, min: 0, default: 0 },
      duration: { type: Number, default: 0 }, // in minutes
    },

    // 📅 Schedule
    date: { type: Date, required: true },
    time: { type: String, default: "" }, // "10:00 AM"
    duration: { type: Number, default: 0 }, // minutes
    rescheduleHistory: {
      type: [
        {
          oldDate: { type: Date, default: null },
          newDate: { type: Date, default: null },
          rescheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          reason: { type: String, trim: true, default: "" },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    // 📍 Location
    location: {
      street: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      zip: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "" },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      },
    },

    // 🚦 Status Tracking
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "In-progress",
        "Completed",
        "Rejected",
        "Cancelled",
        "No-show",
      ],
      default: "Pending",
      index: true,
    },
    statusHistory: {
      type: [
        {
          status: {
            type: String,
            enum: [
              "Pending",
              "Accepted",
              "In-progress",
              "Completed",
              "Rejected",
              "Cancelled",
              "No-show",
            ],
            default: "Pending",
          },
          changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          reason: { type: String, trim: true, default: "" },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    // 💰 Payment & Pricing
    price: { type: Number, min: 0, default: 0 },
    discount: { type: Number, min: 0, default: 0 },
    tax: { type: Number, min: 0, default: 0 },
    finalAmount: { type: Number, min: 0, default: 0 },
    isPaid: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Pending", "Paid", "Refunded", "Failed"],
      default: "Unpaid",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    billing: {
      invoiceNumber: { type: String, trim: true, default: "" },
      receiptUrl: { type: String, trim: true, default: "" },
      billingNotes: { type: String, trim: true, default: "" },
    },

    // 📓 Notes & Instructions
    customerNotes: { type: String, trim: true, default: "" },
    workerNotes: { type: String, trim: true, default: "" },

    // ⭐ Review
    review: {
      rating: { type: Number, min: 1, max: 5, default: undefined },
      comment: { type: String, trim: true, default: "" },
      date: { type: Date, default: null },
    },

    // ⚖️ Dispute Link
    dispute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dispute",
      default: null,
    },

    // 👤 Audit & Meta
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByModel: {
      type: String,
      enum: ["customer", "worker", "admin"],
      required: true,
      default: "customer",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedByModel: {
      type: String,
      enum: ["customer", "worker", "admin"],
      default: null,
    },

    // 🛠️ Metadata for extensions
    metadata: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

// Indexes for performance
BookingSchema.index({ "location.coordinates": "2dsphere" });
BookingSchema.index({ customer: 1 });
BookingSchema.index({ worker: 1 });
BookingSchema.index({ service: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ date: 1 });
// BookingSchema.index({ worker: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Booking", BookingSchema);
