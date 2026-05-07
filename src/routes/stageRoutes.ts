import { createStage, deleteStage, getStages, updateProjectStages, updateStageName } from "../controllers/stageControllers.js";
import express from "express";

const router = express.Router();

router.get("/stages", getStages);
router.post("/create", createStage);
router.post("/update-project/:id", updateProjectStages);
router.delete("/delete/:id", deleteStage);
router.put("/update/:id", updateStageName);

export default router;
