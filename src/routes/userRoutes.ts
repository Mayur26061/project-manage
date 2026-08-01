import express from "express";
import { updateProfile, getUsers, getMe } from "../controllers/userControllers.js";
import { authenticateToken } from "..//middleware/index.js";

const router = express.Router();

router.get("/", authenticateToken, getUsers);
router.get("/me", authenticateToken, getMe);
router.put("/update", authenticateToken, updateProfile);

export default router;
