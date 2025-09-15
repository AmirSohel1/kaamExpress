const Dispute = require("../models/Dispute");

exports.getAllDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find()
      .populate("booking")
      .populate("customer")
      .populate("worker");
    res.json(disputes);
  } catch (err) {
    next(err);
  }
};

exports.getDisputeById = async (req, res, next) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate("booking")
      .populate("customer")
      .populate("worker");
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });
    res.json(dispute);
  } catch (err) {
    next(err);
  }
};

exports.createDispute = async (req, res, next) => {
  try {
    const dispute = await Dispute.create(req.body);
    res.status(201).json(dispute);
  } catch (err) {
    next(err);
  }
};

exports.updateDispute = async (req, res, next) => {
  try {
    const dispute = await Dispute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("booking")
      .populate("customer")
      .populate("worker");
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });
    res.json(dispute);
  } catch (err) {
    next(err);
  }
};

exports.deleteDispute = async (req, res, next) => {
  try {
    const dispute = await Dispute.findByIdAndDelete(req.params.id);
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });
    res.json({ message: "Dispute deleted" });
  } catch (err) {
    next(err);
  }
};
