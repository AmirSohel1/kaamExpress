const express = require("express");
const router = express.Router();

// Mount all resource routers here
router.use("/auth", require("./auth"));
router.use("/users", require("./users"));
router.use("/workers", require("./workers"));
router.use("/customers", require("./customers"));
router.use("/services", require("./services"));
router.use("/bookings", require("./bookings"));
router.use("/review", require("./review"));

router.use("/payments", require("./payments"));
router.use("/disputes", require("./disputes"));
router.use("/analytics", require("./analytics"));
router.use("/notifications", require("./notifications"));

router.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = router;
