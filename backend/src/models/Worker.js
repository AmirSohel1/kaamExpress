const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Services a worker provides (linked to Service collection)
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],

    // Optional free-text skills (not linked to Service)
    customSkills: [{ type: String }],

    experience: { type: Number, default: 0 },
    address: { type: String },
    availability: { type: Boolean, default: true },

    ratings: [
      {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        stars: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],

    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],

    earnings: [
      {
        job: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        amount: { type: Number },
        status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", WorkerSchema);
