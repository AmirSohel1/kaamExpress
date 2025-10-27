const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
require("dotenv").config();

const app = express();

// Build allowed origins list from env vars. Support a single FRONTEND_URL or a
// comma-separated FRONTEND_URLS. Trim spaces so values like " https://..."
// won't break matching.
const normalizeOrigin = (o) => (o ? o.trim().replace(/\/$/, "") : o);
const explicitFrontend = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : [];
const extraFromList = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  ...explicitFrontend,
  ...extraFromList,
]
  .filter(Boolean)
  .map(normalizeOrigin);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalized = normalizeOrigin(origin);
    // Helpful debug log for deployment troubleshooting (will show in server logs)
    if (!allowedOrigins.includes(normalized)) {
      console.warn(
        "Blocked CORS request from origin:",
        origin,
        "normalized:",
        normalized,
        "allowed:",
        allowedOrigins
      );
      return callback(new Error("Not allowed by CORS: " + origin));
    }
    return callback(null, true);
  },
  credentials: true,
};

// ✅ Apply CORS globally before any routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({ crossOriginResourcePolicy: false, crossOriginOpenerPolicy: false })
);
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to the KaamExpress API");
});

// ✅ Ensure error handler is last
app.use(require("./middleware/errorHandler"));

module.exports = app;
