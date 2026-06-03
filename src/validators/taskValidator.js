import { TASK_PRIORITIES, TASK_STATUSES, DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../constants/taskConstants.js';

const isEmpty = (value) => typeof value !== 'string' || value.trim() === '';
const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

const isValidFutureDate = (value) => {
  const dueDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate >= today;
};

export const taskPayloadValidator = (req) => {
  const errors = [];
  const { title, description, status, priority, due_date } = req.body;

  if (isEmpty(title)) {
    errors.push({ field: 'title', message: 'Title is required.' });
  } else if (title.trim().length < 3 || title.trim().length > 150) {
    errors.push({ field: 'title', message: 'Title must be between 3 and 150 characters.' });
  }

  if (isEmpty(description)) {
    errors.push({ field: 'description', message: 'Description is required.' });
  }

  if (!TASK_STATUSES.includes(status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${TASK_STATUSES.join(', ')}.` });
  }

  if (!TASK_PRIORITIES.includes(priority)) {
    errors.push({ field: 'priority', message: `Priority must be one of: ${TASK_PRIORITIES.join(', ')}.` });
  }

  if (due_date && !isValidFutureDate(due_date)) {
    errors.push({ field: 'due_date', message: 'Due date cannot be in the past.' });
  }

  return errors;
};

export const taskQueryValidator = (req) => {
  const errors = [];
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, status, priority } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (!isPositiveInteger(pageNumber)) {
    errors.push({ field: 'page', message: 'Page must be a positive integer.' });
  }

  if (!isPositiveInteger(limitNumber) || limitNumber > MAX_LIMIT) {
    errors.push({ field: 'limit', message: `Limit must be between 1 and ${MAX_LIMIT}.` });
  }

  if (status && !TASK_STATUSES.includes(status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${TASK_STATUSES.join(', ')}.` });
  }

  if (priority && !TASK_PRIORITIES.includes(priority)) {
    errors.push({ field: 'priority', message: `Priority must be one of: ${TASK_PRIORITIES.join(', ')}.` });
  }

  return errors;
};

export const taskIdValidator = (req) => {
  const id = Number(req.params.id);

  if (!isPositiveInteger(id)) {
    return [{ field: 'id', message: 'Task id must be a positive integer.' }];
  }

  return [];
};

export const bulkDeleteValidator = (req) => {
  if (!Array.isArray(req.body.ids) || req.body.ids.length === 0) {
    return [{ field: 'ids', message: 'Ids must be a non-empty array.' }];
  }

  const hasInvalidId = req.body.ids.some((id) => !isPositiveInteger(id));

  if (hasInvalidId) {
    return [{ field: 'ids', message: 'Every task id must be a positive integer.' }];
  }

  return [];
};
