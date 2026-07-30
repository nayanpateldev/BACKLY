import { Router } from "express";

import authRoutes from "./auth.routes.js" 
import toolRoutes from "./tools.routes.js"

const router = Router();

router.use("/tool", toolRoutes)
router.use("/auth", authRoutes)

export default router;