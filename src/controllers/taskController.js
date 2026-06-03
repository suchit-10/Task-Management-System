import { taskModel } from '../models/taskModel.js';
import { created, HttpError, ok } from '../utils/http.js';

export const getTasks = async (req, res) => {
  const { tasks, meta } = await taskModel.findAll(req.query);
  return ok(res, 'Tasks fetched successfully.', tasks, meta);
};

export const getTaskById = async (req, res) => {
  const task = await taskModel.findById(req.params.id);

  if (!task) {
    throw new HttpError('Task not found.', 404);
  }

  return ok(res, 'Task fetched successfully.', task);
};

export const createTask = async (req, res) => {
  const task = await taskModel.create(req.body);
  return created(res, 'Task created successfully.', task);
};

export const updateTask = async (req, res) => {
  const task = await taskModel.update(req.params.id, req.body);

  if (!task) {
    throw new HttpError('Task not found.', 404);
  }

  return ok(res, 'Task updated successfully.', task);
};

export const deleteTask = async (req, res) => {
  const wasDeleted = await taskModel.remove(req.params.id);

  if (!wasDeleted) {
    throw new HttpError('Task not found.', 404);
  }

  return ok(res, 'Task deleted successfully.');
};

export const bulkDeleteTasks = async (req, res) => {
  const ids = req.body.ids.map(Number);
  const deletedCount = await taskModel.removeMany(ids);
  return ok(res, 'Tasks deleted successfully.', { deletedCount });
};

export const getTaskStats = async (req, res) => {
  const stats = await taskModel.stats();
  return ok(res, 'Task stats fetched successfully.', stats);
};
