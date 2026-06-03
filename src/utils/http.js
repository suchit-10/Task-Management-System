export class HttpError extends Error {
  constructor(message, status = 500, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const ok = (res, message, data = null, meta = null) => {
  const response = { success: true, message, data };

  if (meta) {
    response.meta = meta;
  }

  return res.json(response);
};

export const created = (res, message, data) => {
  return res.status(201).json({ success: true, message, data });
};

export const fail = (res, status, message, errors = null) => {
  const response = { success: false, message };

  if (errors) {
    response.errors = errors;
  }

  return res.status(status).json(response);
};
