import { getProjectTasks, getSelectedTask, getTasks } from '@/controllers/taskControllers.js';
import express from 'express';

const router = express.Router();

router.get('/tasks', getTasks)
router.get('/tasks/:projectId', getProjectTasks)
router.get('/:id', getSelectedTask)

export default router;