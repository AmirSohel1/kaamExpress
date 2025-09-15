const isProd = process.env.NODE_ENV === "production";

// Recognize common error types
function getStatusCode(err) {
  if (err.status) return err.status;
  if (err.name === "ValidationError") return 400;
  if (err.name === "UnauthorizedError") return 401;
  if (err.name === "ForbiddenError") return 403;
  if (err.name === "CastError") return 400;
  if (err.code && typeof err.code === "number") return err.code;
  return 500;
}

module.exports = (err, req, res, next) => {
  const status = getStatusCode(err);
  // Log error with request context
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n` +
      (err.stack || err)
  );

  // Build error response
  const errorResponse = {
    error: err.message || "Internal Server Error",
    status,
  };

  // Add validation errors if present
  if (err.errors && typeof err.errors === "object") {
    errorResponse.details = {};
    for (const key in err.errors) {
      errorResponse.details[key] = err.errors[key].message || err.errors[key];
    }
  }

  // In development, include stack trace
  if (!isProd) {
    errorResponse.stack = err.stack;
    errorResponse.path = req.originalUrl;
    errorResponse.method = req.method;
  }

  // In production, mask details for 500 errors
  if (isProd && status === 500) {
    errorResponse.error = "Internal Server Error";
    delete errorResponse.stack;
    delete errorResponse.details;
  }

  res.status(status).json(errorResponse);
};
