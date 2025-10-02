const mongoose = require("mongoose");

const DisputeSchema = new mongoose.Schema(
  {
    // 🔗 Booking Reference
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    // 👤 Who raised the dispute
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👤 Who the dispute is against
    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 📝 Dispute Details
    reason: {
      type: String,
      required: true,
      trim: true,
      default: "No reason provided",
    },
    details: {
      type: String,
      trim: true,
      default: "No additional details provided",
    },

    // 📂 Attachments (evidence)
    attachments: {
      type: [
        {
          url: { type: String, trim: true }, // file or image URL
          type: {
            type: String,
            enum: ["image", "document", "other"],
            default: "other",
          },
          uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    // 📊 Dispute Status
    status: {
      type: String,
      enum: ["Open", "In-progress", "Escalated", "Resolved", "Rejected"],
      default: "Open",
      index: true,
    },

    // 📜 Status History
    statusHistory: {
      type: [
        {
          status: { type: String },
          updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          notes: { type: String, trim: true, default: "" },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    // ⚖️ Resolution
    resolution: {
      decision: {
        type: String,
        trim: true,
        default: "Pending decision",
      },
      notes: {
        type: String,
        trim: true,
        default: "No resolution notes yet",
      },
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // usually admin
      },
      resolvedAt: { type: Date },
    },

    // 🚨 Escalation System
    escalationLevel: {
      type: Number,
      default: 0, // 0 = normal, 1 = escalated to senior admin, 2 = legal
    },
    escalatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 👤 Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🛠️ Metadata for flexibility
    metadata: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

DisputeSchema.index({ booking: 1 });
DisputeSchema.index({ raisedBy: 1 });
DisputeSchema.index({ against: 1 });
DisputeSchema.index({ status: 1 });

module.exports = mongoose.model("Dispute", DisputeSchema);
