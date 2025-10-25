const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
require("dotenv").config();

const app = express();

const normalizeOrigin = (o) => (o ? o.trim().replace(/\/$/, "") : o);
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL]
  .filter(Boolean)
  .map(normalizeOrigin);

// ✅ CORS must be at the top
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser or same-origin requests (no Origin header)
      if (!origin) return callback(null, true);
      const normalized = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// Middleware (AFTER cors)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ✅ Handle OPTIONS preflight requests globally
app.options(
  "*",
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const normalized = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalized)) return callback(null, true);
      return callback(new Error("Not allowed by CORS (preflight): " + origin));
    },
    credentials: true,
  })
);

// Routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to the KaamExpress API");
});

app.use(require("./middleware/errorHandler"));

module.exports = app;
