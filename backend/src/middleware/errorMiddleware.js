
const errorHandler = (err, req, res, next) => {
  if (!err.isOperational || err.statusCode >= 500) {
    console.error('❌ Error:', err);
  } else if (err.statusCode === 404 && err.name === 'NotFoundError') {
    console.log(`ℹ️  ${err.message} - ${req.method} ${req.path}`);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  // Handle PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505':
        statusCode = 409;
        message = 'Resource already exists';
        break;
      case '23503':
        statusCode = 400;
        message = 'Invalid reference';
        break;
      case '22P02':
        statusCode = 400;
        message = 'Invalid data format';
        break;
      case '23502':
        statusCode = 400;
        message = 'Required field missing';
        break;
    }
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
};


const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};


const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}


class ValidationError extends AppError {
  constructor(message, errors = null) {
    super(message, 400, errors);
    this.name = 'ValidationError';
  }
}


class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}


class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}


class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}


class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError
};
