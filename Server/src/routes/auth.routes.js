import { Router } from "express";
import authControllers from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", authControllers.handleSignup)
authRouter.post("/login", authControllers.handleLogin)
authRouter.get("/getUser", authenticate, authControllers.handleMe)
authRouter.post("/logout", authenticate,authControllers.handleLogout)
// Forgot Password
// Reset Password
// Google Auth
// Email Verification

export default authRouter