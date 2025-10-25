const User = require("../models/User");

// Get customer by userId
exports.getCustomerByUserId = async (req, res, next) => {
  try {
    const customer = await User.findOne({ user: req.params.userId }).select(
      "-password"
    );
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// Get all customers
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password");
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

// Get customer by MongoDB _id
exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select("-password");
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// Update customer
exports.updateCustomer = async (req, res, next) => {
  try {
    const updates = req.body;
    const customer = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// Delete customer
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await User.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
};
