// middleware/errorMiddleware.js

/* =========================================
   NOT FOUND HANDLER
========================================= */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message || "Something went wrong";

  // 🔥 Mongoose Bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // 🔥 Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // 🔥 Validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack:
      process.env.NODE_ENV === "production"
        ? null
        : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};