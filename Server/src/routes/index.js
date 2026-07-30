import { Router } from "express";
import authRoutes from "./auth.routes.js" 
import toolRoutes from "./tools.routes.js"
import toolControllers  from "../controllers/tools.controller.js";

const router = Router();

router.use("/tools", toolRoutes)
router.use("/auth", authRoutes)

// Redirect URLs for Users
router.get("/:shortCode", toolControllers.redirectUrl);

export default router;
