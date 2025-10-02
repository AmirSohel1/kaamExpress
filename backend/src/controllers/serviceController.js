const Service = require("../models/Service");

// Create a new service (admin only)
exports.createService = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !price)
      return res.status(400).json({ error: "Name and price are required" });

    const service = await Service.create({
      name,
      description,
      price,
      category,
    });
    res.status(201).json({ message: "Service created", service });
  } catch (err) {
    next(err);
  }
};

// Add multiple services at once (admin only)
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
    res
      .status(201)
      .json({ message: "Services added", services: insertedServices });
  } catch (err) {
    // Handle duplicate key errors gracefully
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "Some services already exist", details: err.keyValue });
    }
    next(err);
  }
};

// Get all services (public)
exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    next(err);
  }
};

// Get service by ID (public)
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    next(err);
  }
};

// Update service (admin only)
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service updated", service });
  } catch (err) {
    next(err);
  }
};

// Delete service (admin only)
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
};
