import {
    getProjectTasks,
    getSelectedTask,
    getTasks,
    getMyTasks,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/taskControllers.js";
import express from "express";

const router = express.Router();

router.get("/", getTasks);
router.get("/mine", getMyTasks);
router.post("/", createTask);
router.get("/:id", getSelectedTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/projects/:projectId", getProjectTasks);

export default router;
