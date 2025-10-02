const Worker = require("../models/Worker");
const User = require("../models/User");
const Service = require("../models/Service");

// =======================
// Update worker
// =======================
exports.updateWorker = async (req, res, next) => {
  try {
    const { ...workerUpdates } = req.body;
    const workerId = req.params.id;

    // Check if worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ error: "Worker not found" });

    // Worker can only update their own profile unless admin
    if (req.user.role !== "admin" && String(worker.user) !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this worker" });
    }

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      { ...workerUpdates, updatedAt: Date.now() },
      { new: true }
    ).populate("user", "-password");

    res.json(updatedWorker);
  } catch (err) {
    next(err);
  }
};

// =======================
// Get my profile (Worker)
// =======================
exports.getMyProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id }).populate(
      "user",
      "-password"
    );
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json(worker);
  } catch (err) {
    next(err);
  }
};

// =======================
// Create worker (Admin only)
// =======================
exports.createWorker = async (req, res, next) => {
  try {
    const {
      user,
      services,
      customSkills,
      experience,
      workingAvailableAddress,
      availability,
    } = req.body;

    const existingUser = await User.findById(user);
    if (!existingUser || existingUser.role !== "worker") {
      return res.status(400).json({ error: "User not found or not a worker" });
    }

    const existingWorker = await Worker.findOne({ user });
    if (existingWorker) {
      return res.status(400).json({ error: "Worker profile already exists" });
    }

    if (services && services.length > 0) {
      const validServices = await Service.find({ _id: { $in: services } });
      if (validServices.length !== services.length) {
        return res
          .status(400)
          .json({ error: "One or more services are invalid" });
      }
    }

    const worker = await Worker.create({
      user,
      services,
      customSkills,
      experience,
      workingAvailableAddress,
      availability,
    });

    const populatedWorker = await worker.populate([
      { path: "user", select: "-password" },
      { path: "services" },
    ]);

    res.status(201).json(populatedWorker);
  } catch (err) {
    next(err);
  }
};

// =======================
// Get public worker profile
// =======================
exports.getPublicWorkerProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate("user", "name email role avatar")
      .populate({
        path: "jobs",
        select: "service date status address payment totalAmount",
        populate: { path: "service", select: "name category" },
      });

    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json(worker);
  } catch (err) {
    next(err);
  }
};

// =======================
// Get all workers (Admin only)
// =======================
exports.getAllWorkers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const workers = await Worker.find({ user: { $exists: true, $ne: null } })
      .populate("user", "name email phone role isActive")
      .lean();

    const orphanWorkers = await Worker.find({
      $or: [{ user: { $exists: false } }, { user: null }],
    }).lean();

    res.json({
      workers,
      orphanWorkersCount: orphanWorkers.length,
      orphanWorkersIds: orphanWorkers.map((w) => w._id),
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// Get worker by ID
// =======================
exports.getWorkerById = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id).populate(
      "user",
      "-password"
    );
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json(worker);
  } catch (err) {
    next(err);
  }
};

// =======================
// Delete worker
// =======================
exports.deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json({ message: "Worker deleted" });
  } catch (err) {
    next(err);
  }
};

// =======================
// Bulk create/update workers (Admin only)
// =======================
exports.bulkCreateUpdateWorkers = async (req, res, next) => {
  try {
    const inputWorkers = req.body.workers || [];

    const users = await User.find({ role: "worker" });
    if (!users.length) {
      return res.status(404).json({ error: "No worker users found" });
    }

    const results = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const workerData = inputWorkers[i % inputWorkers.length] || {};

      const worker = await Worker.findOneAndUpdate(
        { user: user._id },
        { ...workerData, user: user._id, updatedAt: Date.now() },
        { new: true, upsert: true }
      ).populate("user", "name email phone role isActive");

      results.push(worker);
    }

    res.json({
      message: "Workers created/updated successfully",
      workers: results,
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// Get workers by service (via query param)
// =======================
exports.getWorkersByService = async (req, res, next) => {
  try {
    const { service } = req.query;
    if (!service)
      return res.status(400).json({ error: "Service ID is required" });

    const workers = await Worker.find({ services: service }).populate(
      "user",
      "name email"
    );
    res.json(workers);
  } catch (err) {
    next(err);
  }
};

// =======================
// Get workers by service ID (public)
// =======================
exports.getWorkersByServiceId = async (req, res, next) => {
  try {
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ error: "Service not found" });

    const workers = await Worker.find({ services: service._id }).populate(
      "user",
      "name email phone role"
    );

    res.json({
      service: {
        id: service._id,
        name: service.name,
        description: service.description,
      },
      workers,
    });
  } catch (err) {
    next(err);
  }
};
