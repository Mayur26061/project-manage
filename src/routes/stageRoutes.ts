import { createStage, deleteStage, getStages, updateProjectStages, updateStageName } from "../controllers/stageControllers.js";
import express from "express";

const router = express.Router();

router.get("/", getStages);
router.post("/", createStage);
router.delete("/:id", deleteStage);
router.put("/:id", updateStageName);
router.post("/:id/update-project", updateProjectStages);

export default router;
