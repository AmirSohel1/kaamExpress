const Service = require("../models/Service");

// Create a new service (admin only)
exports.createService = async (req, res, next) => {
  try {
    const {
      name,
      description,
      categories,
      priceRange,
      isActive,
      imageUrl,
      duration,
      features,
    } = req.body;

    // Basic validation
    if (!name || !description || !priceRange) {
      return res
        .status(400)
        .json({ error: "Name, description, and price range are required" });
    }

    // Normalize arrays (handle both array or comma-separated strings)
    const formattedCategories = Array.isArray(categories)
      ? categories
      : typeof categories === "string"
      ? categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const formattedFeatures = Array.isArray(features)
      ? features
      : typeof features === "string"
      ? features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    const service = await Service.create({
      name,
      description,
      categories: formattedCategories,
      priceRange,
      isActive: isActive !== undefined ? isActive : true,
      imageUrl,
      duration: duration ? parseInt(duration) : 60,
      features: formattedFeatures,
    });

    res.status(201).json({ message: "Service created successfully", service });
  } catch (err) {
    // Handle duplicate key error (unique name)
    if (err.code === 11000) {
      return res.status(409).json({ error: "Service name already exists" });
    }
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

    // Normalize categories/features for each service
    const formattedServices = services.map((s) => ({
      ...s,
      categories: Array.isArray(s.categories)
        ? s.categories
        : typeof s.categories === "string"
        ? s.categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      features: Array.isArray(s.features)
        ? s.features
        : typeof s.features === "string"
        ? s.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        : [],
      duration: s.duration ? parseInt(s.duration) : 60,
      isActive: s.isActive !== undefined ? s.isActive : true,
    }));

    const insertedServices = await Service.insertMany(formattedServices, {
      ordered: false,
    });

    res
      .status(201)
      .json({
        message: "Services added successfully",
        services: insertedServices,
      });
  } catch (err) {
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
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

// Get a single service by ID (public)
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    next(err);
  }
};

// Update a service (admin only)
exports.updateService = async (req, res, next) => {
  try {
    const {
      name,
      description,
      categories,
      priceRange,
      isActive,
      imageUrl,
      duration,
      features,
    } = req.body;

    // Normalize arrays
    const formattedCategories = Array.isArray(categories)
      ? categories
      : typeof categories === "string"
      ? categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const formattedFeatures = Array.isArray(features)
      ? features
      : typeof features === "string"
      ? features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        categories: formattedCategories,
        priceRange,
        isActive,
        imageUrl,
        duration: duration ? parseInt(duration) : 60,
        features: formattedFeatures,
      },
      { new: true, runValidators: true }
    );

    if (!updatedService)
      return res.status(404).json({ error: "Service not found" });

    res.json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Service name already exists" });
    }
    next(err);
  }
};

// Delete a service (admin only)
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    next(err);
  }
};
