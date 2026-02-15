/**
 * Global Error Handler Middleware
 * Catches and formats all errors consistently
 */
const errorHandler = (err, req, res, next) => {
  // Default error object
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    success: false
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error.statusCode = 400;
    error.message = messages.join(', ');
    error.validationErrors = messages;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error.statusCode = 400;
    error.message = `${field} already exists`;
  }

  // Mongoose cast error (invalid ID format)
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = 'Invalid ID format';
  }

  // JWT errors (handled by middleware, but just in case)
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(error.statusCode).json(error);
};

/**
 * Wrapper for async route handlers to catch errors
 * Usage: router.get('/', asyncHandler(controllerFunction))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, asyncHandler };
