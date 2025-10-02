const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");

// Use explicit RESTful paths
router.post("/create", auth(["customer"]), reviewController.createReview);
router.get(
  "/worker/:workerId",
  auth(["worker", "admin"]),
  reviewController.getReviewsForWorker
);
router.get(
  "/all",
  auth(["customer", "admin", "worker"]),
  reviewController.getAllReviews
);

module.exports = router;
