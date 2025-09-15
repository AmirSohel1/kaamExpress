const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema(
  {
    totalUsers: { type: Number, default: 0 },
    totalWorkers: { type: Number, default: 0 },
    totalCustomers: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    monthlyBookings: [{ month: String, count: Number }],
    monthlyRevenue: [{ month: String, amount: Number }],
    serviceDistribution: [{ service: String, count: Number }],
    workerStatus: [{ status: String, count: Number }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", AnalyticsSchema);
