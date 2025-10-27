const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
require("dotenv").config();

const app = express();

const normalizeOrigin = (o) => (o ? o.trim().replace(/\/$/, "") : o);
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5000",
  "http://localhost:4000",
]
  .filter(Boolean)
  .map(normalizeOrigin);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalized = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalized)) return callback(null, true);
    return callback(new Error("Not allowed by CORS: " + origin));
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
