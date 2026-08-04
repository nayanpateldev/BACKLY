import { Router } from "express";
import toolControllers from "../controllers/tools.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  generateUrlQrSchema,
  generateUpiQrSchema,
} from "../utils/qr.validation.js";
import {
  generatePasswordSchema,
  passwordStrengthSchema,
} from "../utils/authkit.validation.js";
import {
  jwtSecretSchema,
  jwtDecodeSchema,
  jwtEncodeSchema,
  jwtVerifySchema,
} from "../utils/jwt.validations.js";
import {
  generateBasicHashSchema,
  generateSaltHashSchema,
  generateSaltPepperHashSchema,
  verifyBasicHashSchema,
  verifySaltHashSchema,
  verifySaltPepperHashSchema,
} from "../utils/hash.validation.js";

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
  validate(generatePasswordSchema),
  toolControllers.generatePassword,
);
toolRouter.post(
  "/authKit/password/strength",
  authenticate,
  validate(passwordStrengthSchema),
  toolControllers.passwordStrength,
);

// Hash Generator

// Basic Hashing
toolRouter.post(
  "/authKit/hash/basic/generate",
  authenticate,
  validate(generateBasicHashSchema),
  toolControllers.generateBasicHash,
);
toolRouter.post(
  "/authKit/hash/basic/verify",
  authenticate,
  validate(verifyBasicHashSchema),
  toolControllers.verifyBasicHash,
);

// Salt Hash
toolRouter.post(
  "/authKit/hash/salt/generate",
  authenticate,
  validate(generateSaltHashSchema),
  toolControllers.generateSaltHash,
);
toolRouter.post(
  "/authKit/hash/salt/verify",
  authenticate,
  validate(verifySaltHashSchema),
  toolControllers.verifySaltHash,
);

// Salt + Pepper Hash
toolRouter.post(
  "/authKit/hash/salt-pepper/generate",
  authenticate,
  validate(generateSaltPepperHashSchema),
  toolControllers.generateSaltPepperHash,
);
toolRouter.post(
  "/authKit/hash/salt-pepper/verify",
  authenticate,
  validate(verifySaltPepperHashSchema),
  toolControllers.verifySaltPepperHash,
);

// JWT Toolkit
toolRouter.post(
  "/authKit/jwt/secret",
  authenticate,
  validate(jwtSecretSchema),
  toolControllers.generateJwtSecret,
);
toolRouter.post(
  "/authKit/jwt/decode",
  authenticate,
  validate(jwtDecodeSchema),
  toolControllers.decodeJwt,
);
toolRouter.post(
  "/authKit/jwt/verify",
  authenticate,
  validate(jwtVerifySchema),
  toolControllers.verifyJwt,
);
toolRouter.post(
  "/authKit/jwt/encode",
  authenticate,
  validate(jwtEncodeSchema),
  toolControllers.encodeJwt,
);

export default toolRouter;
