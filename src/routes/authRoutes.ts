import express from "express";
import { changePassword, logOut, signIn, signUp } from "../controllers/userControllers.js";
import { authenticateToken } from "..//middleware/index.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/logout", authenticateToken, logOut);
router.post("/change-password", authenticateToken, changePassword);

export default router;
