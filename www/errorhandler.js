// errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error(err.stack);
  
    // Determine the status code
    const statusCode = err.status || 500;
  
    // Send a structured error response
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  
  module.exports = errorHandler;
  