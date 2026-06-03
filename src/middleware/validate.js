import { HttpError } from '../utils/http.js';

export const validate = (schema) => (req, res, next) => {
  const errors = schema(req);

  if (errors.length > 0) {
    return next(new HttpError('Validation failed', 400, errors));
  }

  return next();
};
