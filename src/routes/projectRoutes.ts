import {
    getProjects,
    getSelectedProject,
    createProject,
    getProjectStages,
} from "../controllers/projectControllers.js";
import express from "express";

const router = express.Router();

router.get("/projects", getProjects);
router.get("/:id", getSelectedProject);
router.get("/:id/stages", getProjectStages);
router.post("/create", createProject);

export default router;
