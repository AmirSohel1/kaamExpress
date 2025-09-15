// Public: Get worker profile by ID (for customers)
exports.getPublicWorkerProfile = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate("user", "name email role avatar") // Only expose safe fields
      .populate({
        path: "jobs",
        select: "service date status address payment totalAmount",
        populate: { path: "service", select: "name category" },
      });
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    // Optionally filter out fields you don't want to expose
    const workerObj = worker.toObject();
    delete workerObj.user.password;
    // You may also want to filter earnings, etc.
    res.json(workerObj);
  } catch (err) {
    next(err);
  }
};
const Worker = require("../models/Worker");
const User = require("../models/User");
const Service = require("../models/Service");

// Create a worker
exports.createWorker = async (req, res, next) => {
  try {
    const { user, services, customSkills, experience, address, availability } =
      req.body;

    // Check if User exists and is a worker
    const existingUser = await User.findById(user);
    if (!existingUser || existingUser.role !== "worker") {
      return res.status(400).json({ error: "User not found or not a worker" });
    }

    // Prevent duplicate worker profile
    const existingWorker = await Worker.findOne({ user });
    if (existingWorker) {
      return res
        .status(400)
        .json({ error: "Worker document already exists for this User" });
    }

    // Validate services (optional, ensure they exist in DB)
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
      address,
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

// Get all workers (Admin only)
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

// Get worker by ID
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

// Get my profile (Worker)
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

// Update worker
exports.updateWorker = async (req, res, next) => {
  try {
    const { ...workerUpdates } = req.body;

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { ...workerUpdates, updatedAt: Date.now() },
      { new: true }
    ).populate("user", "-password");

    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json(worker);
  } catch (err) {
    next(err);
  }
};

// Delete worker
exports.deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json({ message: "Worker deleted" });
  } catch (err) {
    next(err);
  }
};

// Bulk create/update workers (Admin only)
exports.bulkCreateUpdateWorkers = async (req, res, next) => {
  try {
    const inputWorkers = req.body.workers || [];

    const users = await User.find({ role: "worker" });
    if (!users.length) {
      return res.status(404).json({ error: "No workers found in User table" });
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

// Get workers by service (Public)
exports.getWorkersByService = async (req, res, next) => {
  try {
    const { service } = req.query;
    const workers = await Worker.find({ skills: service }).populate(
      "user",
      "name email"
    );
    res.json(workers);
  } catch (err) {
    next(err);
  }
};

exports.getWorkersByServiceId = async (req, res, next) => {
  try {
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ error: "Service not found" });

    // Find workers who have this service name in their skills array
    const workers = await Worker.find({ skills: service.name }).populate(
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
