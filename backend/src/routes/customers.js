const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const auth = require("../middleware/auth");

router.get("/user/:userId", customerController.getCustomerByUserId);

// Admin only
router.get("/", auth(["admin"]), customerController.getAllCustomers);

router.get(
  "/:id",
  auth(["admin", "customer"]),
  customerController.getCustomerById
);

router.put(
  "/:id",
  auth(["admin", "customer"]),
  customerController.updateCustomer
);

router.delete("/:id", auth("admin"), customerController.deleteCustomer);

module.exports = router;
