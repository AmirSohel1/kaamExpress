const Service = require("../models/Service");

// ✅ Create (single)
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

// ✅ Bulk Insert (for seeding multiple)
exports.addMultipleServices = async (req, res, next) => {
  try {
    const { services } = req.body;
    if (!Array.isArray(services) || services.length === 0) {
      return res
        .status(400)
        .json({ error: "An array of services is required" });
    }

    const insertedServices = await Service.insertMany(services, {
      ordered: false,
    });
    res.status(201).json(insertedServices);
  } catch (err) {
    next(err);
  }
};

// ✅ Get All
exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    next(err);
  }
};

// ✅ Get One by ID
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    next(err);
  }
};

// ✅ Update
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
};
