const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const auth = require("../middleware/auth");

// Public
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

// Admin Protected
router.post("/", auth("admin"), serviceController.createService);
router.post("/bulk", auth("admin"), serviceController.addMultipleServices);
router.put("/:id", auth("admin"), serviceController.updateService);
router.delete("/:id", auth("admin"), serviceController.deleteService);

module.exports = router;
