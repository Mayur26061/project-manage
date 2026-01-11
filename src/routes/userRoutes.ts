import express from "express";
import { getMe, signIn, signUp } from "../controllers/userControllers.js";
import { authenticateToken } from "..//middleware/index.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/me", authenticateToken, getMe);

export default router;
