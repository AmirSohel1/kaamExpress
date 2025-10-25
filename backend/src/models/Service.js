const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, maxlength: 500 },
    categories: [{ type: String, trim: true }],
    priceRange: { type: String, required: true, trim: true }, // e.g., "₹500-800"
    isActive: { type: Boolean, default: true },

    // 🆕 Added based on frontend
    imageUrl: { type: String }, // could be a base64 string or hosted URL
    duration: { type: Number, default: 60 }, // in minutes
    features: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
