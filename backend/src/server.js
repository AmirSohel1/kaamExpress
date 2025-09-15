const mongoose = require("mongoose");
const app = require("./app");
const { mongoUri } = require("./config/db");

const PORT = process.env.PORT || 5000;

mongoose
  .connect(mongoUri) // no extra options needed in Mongoose 6+
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
