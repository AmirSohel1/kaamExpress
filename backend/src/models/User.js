const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// =========================
// 📌 User Schema Definition
// =========================
const UserSchema = new mongoose.Schema(
  {
    // 🔑 Core Authentication
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "worker", "customer"],
      default: "customer",
    },
    isActive: { type: Boolean, default: true },

    // 📞 Contact & Verification
    phone: { type: String, trim: true, default: "" },
    phoneVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },

    // 👤 Profile Info (optional at signup)
    profilePicture: { type: String, default: "" }, // file URL
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      },
      default: {},
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    bio: { type: String, trim: true, default: "" },

    // 📊 Metadata & Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    metadata: { type: Map, of: String },
  },
  { timestamps: true }
);

// =========================
// 🔐 Password Middleware
// =========================

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Hash passwords in bulk inserts
UserSchema.pre("insertMany", async function (next, docs) {
  try {
    for (let doc of docs) {
      if (doc.password && !doc.password.startsWith("$2b$")) {
        doc.password = await bcrypt.hash(doc.password, 10);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

// =========================
// 🔑 Schema Methods
// =========================

// Compare input password with hashed password
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
