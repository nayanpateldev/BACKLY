import { Router } from "express";
import toolControllers from "../controllers/tools.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  generateUrlQrSchema,
  generateUpiQrSchema,
} from "../utils/qr.validation.js";
import { jwtSecretSchema, jwtDecodeSchema, jwtEncodeSchema} from "../utils/jwt.validations.js";

const toolRouter = Router();

// #################  Tool No. 1 #####################
// URL Shortner Endpoints
toolRouter.post("/urlShortner", authenticate, toolControllers.createShortUrl);
toolRouter.get("/urlShortner", authenticate, toolControllers.getUrls);
toolRouter.get("/urlShortner/:id", authenticate, toolControllers.getUrlById);

// #################  Tool No. 2 #####################
// PasteBin Endpoints
toolRouter.post("/pasteBin", toolControllers.pasteBin);

// #################  Tool No. 3 #####################
// QR Code Generator Endpoints
toolRouter.post(
  "/qr/url",
  authenticate,
  validate(generateUrlQrSchema),
  toolControllers.generateUrlQr,
);
toolRouter.post(
  "/qr/upi",
  authenticate,
  validate(generateUpiQrSchema),
  toolControllers.generateUpiQr,
);

// #################  Tool No. 4 #####################
// File Sharing Endpoints
toolRouter.post("/fileShare", toolControllers.fileShare);

// #################  Tool No. 5 #####################
// AuthKit Endpoints

// Password Generator
toolRouter.post(
  "/authKit/password/generate",
  authenticate,
  toolControllers.generatePassword,
);
toolRouter.post(
  "/authKit/password/strength",
  authenticate,
  toolControllers.passwordStrength,
);

// JWT Toolkit
toolRouter.post(
  "/authKit/jwt/secret",
  authenticate, validate(jwtSecretSchema),
  toolControllers.generateJwtSecret,
);
toolRouter.post(
  "/authKit/jwt/decode",
  authenticate,
  validate(jwtDecodeSchema),
  toolControllers.decodeJwt,
);
toolRouter.post("/authKit/jwt/encode", authenticate, validate(jwtEncodeSchema), toolControllers.encodeJwt);



export default toolRouter;
