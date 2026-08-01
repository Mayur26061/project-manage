import {
    getProjects,
    getSelectedProject,
    createProject,
    getProjectStages,
    updateProject,
    deleteProject
} from "../controllers/projectControllers.js";
import express from "express";

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getSelectedProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject)
router.get("/:id/stages", getProjectStages);

export default router;
