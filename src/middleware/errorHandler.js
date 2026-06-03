import { fail } from '../utils/http.js';

export const notFoundHandler = (req, res) => {
  return fail(res, 404, `Route ${req.originalUrl} not found`);
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong' : err.message;

  if (status === 500) {
    console.error(err);
  }

  return fail(res, status, message, err.errors);
};
