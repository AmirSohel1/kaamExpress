require("dotenv").config();

module.exports = {
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/kaamexpress",
};
