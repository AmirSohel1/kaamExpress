const Dispute = require("../models/Dispute");
const Booking = require("../models/Booking");
const NotificationController = require("./notificationController");

// 📌 Get all disputes (admin sees all, others see only theirs)
exports.getAllDisputes = async (req, res, next) => {
  try {
    const user = req.user;

    let filter = {};
    if (user.role === "customer") filter.raisedBy = user.id;
    if (user.role === "worker") filter.against = user.id;

    const disputes = await Dispute.find(filter)
      .populate("booking")
      .populate("raisedBy", "name email")
      .populate("against", "name email")
      .sort({ createdAt: -1 });

    res.json(disputes);
  } catch (err) {
    next(err);
  }
};

// 📌 Get single dispute
exports.getDisputeById = async (req, res, next) => {
  try {
    const user = req.user;

    const dispute = await Dispute.findById(req.params.id)
      .populate("booking")
      .populate("raisedBy", "name email")
      .populate("against", "name email");

    if (!dispute) return res.status(404).json({ error: "Dispute not found" });

    // Authorization
    if (
      user.role !== "admin" &&
      dispute.raisedBy._id.toString() !== user.id &&
      dispute.against?._id.toString() !== user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(dispute);
  } catch (err) {
    next(err);
  }
};

// 📌 Create a dispute
exports.createDispute = async (req, res, next) => {
  try {
    const user = req.user;
    const { bookingId, reason, details, attachments } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Only customer or worker can raise dispute
    if (
      user.role === "customer" &&
      booking.customer.toString() !== user.id &&
      user.role === "worker" &&
      booking.worker.toString() !== user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const dispute = await Dispute.create({
      booking: booking._id,
      raisedBy: user.id,
      against: user.role === "customer" ? booking.worker : booking.customer,
      reason,
      details,
      attachments: attachments || [],
      createdBy: user.id,
      statusHistory: [{ status: "Open", updatedBy: user.id, notes: reason }],
    });

    // Link dispute back to booking
    booking.dispute = dispute._id;
    await booking.save();

    // 🔔 Notify both parties
    await NotificationController.createNotification({
      sender: user.id,
      receiver: booking.customer,
      message: `A dispute has been raised for booking #${booking._id}.`,
      type: "dispute",
    });

    await NotificationController.createNotification({
      sender: user.id,
      receiver: booking.worker,
      message: `A dispute has been raised for booking #${booking._id}.`,
      type: "dispute",
    });

    res.status(201).json({ message: "Dispute created", dispute });
  } catch (err) {
    next(err);
  }
};

// 📌 Update dispute (status, resolution, escalation)
exports.updateDispute = async (req, res, next) => {
  try {
    const user = req.user;
    const { status, resolution, escalationLevel, attachments } = req.body;

    let dispute = await Dispute.findById(req.params.id).populate("booking");
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });

    // Authorization: only admin or involved users
    if (
      user.role !== "admin" &&
      dispute.raisedBy.toString() !== user.id &&
      dispute.against?.toString() !== user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update status + history
    if (status) {
      dispute.status = status;
      dispute.statusHistory.push({
        status,
        updatedBy: user.id,
        notes: req.body.notes || "",
      });
    }

    // Update resolution (only admin usually)
    if (resolution && user.role === "admin") {
      dispute.resolution = {
        ...dispute.resolution,
        decision: resolution.decision || dispute.resolution.decision,
        notes: resolution.notes || dispute.resolution.notes,
        resolvedBy: user.id,
        resolvedAt: new Date(),
      };
    }

    // Escalation
    if (escalationLevel !== undefined && user.role === "admin") {
      dispute.escalationLevel = escalationLevel;
      dispute.escalatedBy = user.id;
    }

    // Attach more evidence
    if (attachments && attachments.length > 0) {
      dispute.attachments.push(
        ...attachments.map((a) => ({ ...a, uploadedBy: user.id }))
      );
    }

    dispute.updatedBy = user.id;
    await dispute.save();

    // 🔔 Notify both parties
    if (status || resolution) {
      await NotificationController.createNotification({
        sender: user.id,
        receiver: dispute.raisedBy,
        message: `Dispute #${dispute._id} status updated to "${
          status || dispute.status
        }".`,
        type: "dispute",
      });

      if (dispute.against) {
        await NotificationController.createNotification({
          sender: user.id,
          receiver: dispute.against,
          message: `Dispute #${dispute._id} status updated to "${
            status || dispute.status
          }".`,
          type: "dispute",
        });
      }
    }

    dispute = await dispute.populate([
      { path: "booking" },
      { path: "raisedBy", select: "name email" },
      { path: "against", select: "name email" },
    ]);

    res.json({ message: "Dispute updated", dispute });
  } catch (err) {
    next(err);
  }
};

// 📌 Delete dispute (only admin)
exports.deleteDispute = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can delete disputes" });
    }

    const dispute = await Dispute.findByIdAndDelete(req.params.id);
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });

    // Unlink from booking
    await Booking.findByIdAndUpdate(dispute.booking, {
      $unset: { dispute: "" },
    });

    res.json({ message: "Dispute deleted" });
  } catch (err) {
    next(err);
  }
};
