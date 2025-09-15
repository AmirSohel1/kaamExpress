// Public: get worker profile by ID (for customers)
const express = require("express");
const router = express.Router();
const workerController = require("../controllers/workerController");
const auth = require("../middleware/auth");

router.get("/public/:id", workerController.getPublicWorkerProfile);
// Admin only: get all workers
router.get("/", auth("admin"), workerController.getAllWorkers);

// Worker fetch their own profile
router.get("/me/profile", auth("worker"), workerController.getMyProfile);

// Get worker by ID (admin or worker)
router.get("/:id", auth(["admin", "worker"]), workerController.getWorkerById);

// Create worker (admin or worker) — optional
router.post("/", workerController.createWorker);

// Update worker
router.put("/:id", auth(["admin", "worker"]), workerController.updateWorker);

// Delete worker (admin only)
router.delete("/:id", auth("admin"), workerController.deleteWorker);

// Bulk update workers (admin only)
router.post(
  "/bulk-update",
  auth("admin"),
  workerController.bulkCreateUpdateWorkers
);

// Public: get workers by service
router.get("/by-service", workerController.getWorkersByService);

router.get("/service/:id", workerController.getWorkersByServiceId);

module.exports = router;
