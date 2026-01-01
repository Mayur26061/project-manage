import { getProjects, getSelectedProject } from '../controllers/projectControllers.js';
import express from 'express';

const router = express.Router();

router.get('/projects', getProjects)
router.get('/:id', getSelectedProject)

export default router;