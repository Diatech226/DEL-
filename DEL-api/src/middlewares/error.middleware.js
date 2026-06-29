const env = require('../config/env');

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || (err.name === 'CastError' ? 404 : 500);
  const payload = {
    success: false,
    message: err.name === 'CastError' ? 'Resource not found' : err.message || 'Server error',
  };

  if (err.issues) payload.errors = err.issues;
  if (env.nodeEnv !== 'production') payload.stack = err.stack;

  res.status(statusCode).json(payload);
};
module.exports = errorMiddleware;
