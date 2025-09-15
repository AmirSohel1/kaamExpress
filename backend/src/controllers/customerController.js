// Get customer by userId (for frontend booking flow)
exports.getCustomerByUserId = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      user: req.params.userId,
    }).populate("user", "-password");
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};
const Customer = require("../models/Customer");
const User = require("../models/User");

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().populate("user", "-password");
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "user",
      "-password"
    );
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const updates = req.body;
    const customer = await Customer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate("user", "-password");
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    next(err);
  }
};
