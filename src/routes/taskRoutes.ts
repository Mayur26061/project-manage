import {
    getProjectTasks,
    getSelectedTask,
    getTasks,
    createTask,
} from "../controllers/taskControllers.js";
import express from "express";

const router = express.Router();

router.get("/tasks", getTasks);
router.get("/tasks/:projectId", getProjectTasks);
router.get("/:id", getSelectedTask);
router.post("/create", createTask);

export default router;
