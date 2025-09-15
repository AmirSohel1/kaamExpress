const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");

router.get("/", auth(["worker", "customer"]), paymentController.getAllPayments);
router.get(
  "/admin",
  auth(["admin", "customer", "worker"]),
  paymentController.getAllPaymentsAdmin
);
router.get(
  "/:id",
  auth(["admin", "worker", "customer"]),
  paymentController.getPaymentById
);
router.post("/", auth(["admin", "customer"]), paymentController.createPayment);
router.put("/:id", auth(["admin", "worker"]), paymentController.updatePayment);
router.delete("/:id", auth("admin"), paymentController.deletePayment);

module.exports = router;
