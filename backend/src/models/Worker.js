const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema(
  {
    // 🔗 Link to User account
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /// 🔧 Services & Skills
    services: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
      default: [],
    },
    primarySkill: { type: String, trim: true, default: "" },
    secondarySkills: { type: [{ type: String, trim: true }], default: [] },
    customSkills: { type: [{ type: String, trim: true }], default: [] },
    certifications: {
      type: [
        {
          name: { type: String, trim: true, default: "" },
          issuedBy: { type: String, trim: true, default: "" },
          year: { type: Number, default: 0 },
          documentUrl: { type: String, trim: true, default: "" },
        },
      ],
      default: [],
    },

    // 💼 Experience & Previous Work
    experience: { type: Number, default: 0 }, // years
    previousJobs: {
      type: [
        {
          company: { type: String, trim: true, default: "" },
          role: { type: String, trim: true, default: "" },
          duration: { type: String, trim: true, default: "" },
          description: { type: String, trim: true, default: "" },
        },
      ],
      default: [],
    },

    // 🏠 Address & Location
    workingAvailableAddress: {
      range: { type: Number, default: 10 },
      street: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      zip: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "" },
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
      },
    },

    // ⏰ Availability & Work Preferences
    availability: { type: Boolean, default: true },
    workDays: {
      type: [
        {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
      ],
      default: [],
    },
    availableShifts: {
      type: [{ type: String, enum: ["Morning", "Afternoon", "Evening"] }],
      default: [],
    },
    maxHoursPerDay: { type: Number, default: 8 },
    workPreferences: { type: [{ type: String }], default: [] },
    dailyRate: { type: Number, default: 0 },

    // 🚗 Transport
    transportMode: {
      type: String,
      enum: ["Own Vehicle", "Public Transport", "Walk"],
      default: "Walk",
    },
    distanceWillingToTravel: { type: Number, default: 10 },

    // 🏥 Health & Safety
    healthStatus: { type: String, default: "Fit" },
    injuryHistory: {
      type: [
        {
          date: { type: Date, default: Date.now },
          description: { type: String, trim: true, default: "" },
        },
      ],
      default: [],
    },
    insurance: {
      provider: { type: String, trim: true, default: "" },
      policyNumber: { type: String, trim: true, default: "" },
      coverage: { type: String, trim: true, default: "" },
    },

    // 📝 Identity & Legal Info
    idProof: { type: String, default: "" },
    licenseNumber: { type: String, default: "" },
    emergencyContacts: {
      type: [
        {
          name: { type: String, trim: true, default: "" },
          phone: { type: String, trim: true, default: "" },
          relation: { type: String, trim: true, default: "" },
        },
      ],
      default: [],
    },

    // 🌟 Ratings & Reviews
    ratings: {
      type: [
        {
          customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          stars: { type: Number, min: 1, max: 5, default: 5 },
          comment: { type: String, trim: true, default: "" },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    // 📝 Jobs (linked to Booking)
    jobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
      default: [],
    },

    // ⚙️ Status & Admin Info
    isActive: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    metadata: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

// Create geospatial index for location
WorkerSchema.index({ "workingAvailableAddress.location": "2dsphere" });

module.exports = mongoose.model("Worker", WorkerSchema);
