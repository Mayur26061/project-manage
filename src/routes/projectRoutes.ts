import {
    getProjects,
    getSelectedProject,
    createProject,
    getProjectStages,
    getLimitedProjects,
    updateProject,
} from "../controllers/projectControllers.js";
import express from "express";

const router = express.Router();

router.get("/projects", getProjects);
router.get("/:id", getSelectedProject);
router.get("/:id/stages", getProjectStages);
router.post("/create", createProject);
router.post("/limited", getLimitedProjects);
router.put("/update/:id", updateProject);

export default router;
