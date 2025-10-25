const express = require("express");
const router = express.Router();
const workerController = require("../controllers/workerController");
const auth = require("../middleware/auth");

// =======================
// Public Routes
// =======================
router.get("/public/:id", workerController.getPublicWorkerProfile);
router.get("/by-service", workerController.getWorkersByService);
router.get("/service/:id", workerController.getWorkersByServiceId);

// =======================
// Protected Routes
// =======================
router.get("/me/profile", auth(["worker"]), workerController.getMyProfile);
router.get("/", auth(["admin"]), workerController.getAllWorkers);
router.get("/:id", auth(["admin", "worker"]), workerController.getWorkerById);
router.post("/", auth(["admin", "worker"]), workerController.createWorker);
router.put("/:id", auth(["admin", "worker"]), workerController.updateWorker);
router.delete("/:id", auth(["admin"]), workerController.deleteWorker);
router.post(
  "/bulk-update",
  auth(["admin"]),
  workerController.bulkCreateUpdateWorkers
);

router.put(
  "/verifyWorker/:workerId",
  auth(["admin"]),
  workerController.verifyWorker
);
router.put(
  "/rejectWorker/:workerId",
  auth(["admin"]),
  workerController.rejectWorker
);

module.exports = router;
