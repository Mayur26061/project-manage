import express from "express";
import { getLimitedUsers, getMe, logOut, signIn, signUp } from "../controllers/userControllers.js";
import { authenticateToken } from "..//middleware/index.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/me", authenticateToken, getMe);
router.post("/limited", authenticateToken, getLimitedUsers);
router.post("/logout", authenticateToken, logOut);

export default router;
