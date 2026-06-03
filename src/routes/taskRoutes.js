import express from 'express';
import {
  bulkDeleteTasks,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  getTaskStats,
  updateTask
} from '../controllers/taskController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { bulkDeleteValidator, taskIdValidator, taskPayloadValidator, taskQueryValidator } from '../validators/taskValidator.js';

const router = express.Router();

const handlers = {
  stats: asyncHandler(getTaskStats),
  bulkDelete: asyncHandler(bulkDeleteTasks),
  list: asyncHandler(getTasks),
  getOne: asyncHandler(getTaskById),
  create: asyncHandler(createTask),
  update: asyncHandler(updateTask),
  remove: asyncHandler(deleteTask)
};

router.get('/stats', handlers.stats);
router.delete('/bulk', validate(bulkDeleteValidator), handlers.bulkDelete);
router.get('/', validate(taskQueryValidator), handlers.list);
router.get('/:id', validate(taskIdValidator), handlers.getOne);
router.post('/', validate(taskPayloadValidator), handlers.create);
router.put('/:id', validate(taskIdValidator), validate(taskPayloadValidator), handlers.update);
router.delete('/:id', validate(taskIdValidator), handlers.remove);

export default router;
