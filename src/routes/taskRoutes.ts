import {
    getProjectTasks,
    getSelectedTask,
    getTasks,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/taskControllers.js";
import express from "express";

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.get("/:id", getSelectedTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/projects/:projectId", getProjectTasks);

export default router;
