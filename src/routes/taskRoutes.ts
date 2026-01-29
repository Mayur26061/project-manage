import {
    getProjectTasks,
    getSelectedTask,
    getTasks,
    createTask,
    updateTask,
} from "../controllers/taskControllers.js";
import express from "express";

const router = express.Router();

router.get("/tasks", getTasks);
router.get("/tasks/:projectId", getProjectTasks);
router.get("/:id", getSelectedTask);
router.post("/create", createTask);
router.put("/update/:id", updateTask);

export default router;
