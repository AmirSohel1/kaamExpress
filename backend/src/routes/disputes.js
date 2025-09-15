const express = require("express");
const router = express.Router();
const disputeController = require("../controllers/disputeController");
const auth = require("../middleware/auth");

router.get(
  "/",
  auth(["admin", "worker", "customer"]),
  disputeController.getAllDisputes
);
router.get(
  "/:id",
  auth(["admin", "worker", "customer"]),
  disputeController.getDisputeById
);
router.post(
  "/",
  auth(["admin", "customer", "worker"]),
  disputeController.createDispute
);
router.put("/:id", auth(["admin", "worker"]), disputeController.updateDispute);
router.delete("/:id", auth("admin"), disputeController.deleteDispute);

module.exports = router;
