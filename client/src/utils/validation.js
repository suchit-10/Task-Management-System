import { PRIORITIES, STATUSES } from '../constants';

export const validateTask = (task) => {
  const errors = {};
  const title = task.title.trim();
  const description = task.description.trim();

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < 3 || title.length > 150) {
    errors.title = 'Title must be between 3 and 150 characters.';
  }

  if (!description) {
    errors.description = 'Description is required.';
  }

  if (!STATUSES.includes(task.status)) {
    errors.status = 'Choose a valid status.';
  }

  if (!PRIORITIES.includes(task.priority)) {
    errors.priority = 'Choose a valid priority.';
  }

  if (task.due_date) {
    const dueDate = new Date(`${task.due_date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(dueDate.getTime()) || dueDate < today) {
      errors.due_date = 'Due date cannot be in the past.';
    }
  }

  return errors;
};
