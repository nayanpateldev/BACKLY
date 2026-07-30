import { Router } from "express";
import toolControllers from "../controllers/tools.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const toolRouter = Router();


// #################  Tool No. 1 #####################
// URL Shortner Endpoints
toolRouter.post("/urlShortner", authenticate, toolControllers.createShortUrl);
toolRouter.get("/urlShortner", authenticate,toolControllers.getUrls);
toolRouter.get("/urlShortner/:id", authenticate,toolControllers.getUrlById);


// #################  Tool No. 2 #####################
// PasteBin Endpoints
toolRouter.post("/pasteBin", toolControllers.pasteBin);



// #################  Tool No. 3 #####################
// QR Code Generator Endpoints
toolRouter.post("/qr", toolControllers.qr);



// #################  Tool No. 4 #####################
// File Sharing Endpoints
toolRouter.post("/fileShare", toolControllers.fileShare);



// #################  Tool No. 5 #####################
// AuthKit Endpoints
toolRouter.post("/authKit", toolControllers.authKit);



export default toolRouter;