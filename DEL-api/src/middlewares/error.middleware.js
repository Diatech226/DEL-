const env = require('../config/env');

const errorMiddleware = (err, req, res, next) => {
  const isValidation = err.name === 'ZodError';
  const statusCode = err.statusCode || (err.name === 'CastError' ? 404 : isValidation ? 400 : 500);
  const firstIssue = isValidation ? err.issues?.[0]?.message : null;
  const payload = { success: false, message: err.name === 'CastError' ? 'Ressource introuvable' : firstIssue || err.message || 'Erreur serveur' };
  if (env.nodeEnv !== 'production') payload.stack = err.stack;
  res.status(statusCode).json(payload);
};
module.exports = errorMiddleware;
