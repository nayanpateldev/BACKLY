import toolServices from "../services/tools.services.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { generateShortUrl } from "../utils/url.js";

const toolControllers = {
  // ########################################
  // ##########   URL Shortner     ##########
  // ########################################
  // URL Shortner
  createShortUrl: async (req, res) => {
    try {
      const { originalUrl, customAlias } = req.body;

      const data = await toolServices.createShortUrl({
        userId: req.user.id,
        originalUrl,
        customAlias,
      });
      console.log("Inserted data:", data);
      return successResponse(res, 201, "Short URL created successfully", {
        ...data,
        shortUrl: generateShortUrl(data.shortCode),
      });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },
  // Redirects the Short URL
  redirectUrl: async (req, res) => {
    try {
      const { shortCode } = req.params;
      const url = await toolServices.redirectUrl(shortCode);
      return res.redirect(302, url.originalUrl);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },
  // Gets Lists of all URLs for the user
  getUrls: async (req, res) => {
    try {
      const data = await toolServices.getUrls(req);

      return successResponse(res, 200, "URLs fetched successfully", data);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },
  // Gets a single URL by ID for the user
  getUrlById: async (req, res) => {
    try {
      const data = await toolServices.getUrlById(req);

      return successResponse(res, 200, "URL fetched successfully", data);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  // #############################################
  // ##########   QR Code Generator     ##########
  // #############################################
  // Generates a QR Code for a given URL
  generateUrlQr: async (req, res) => {
    try {
      const data = await toolServices.generateUrlQr(req);

      return successResponse(res, 200, "QR Code generated successfully", data);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },
  // Generates a QR Code for a given UPI ID
  generateUpiQr: async (req, res) => {
    try {
      const data = await toolServices.generateUpiQr(req);

      return successResponse(res, 200, "UPI QR generated successfully", data);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  // ##############################################
  // ##########   Password Generator     ##########
  // ##############################################
  // Password Generator
  generatePassword: async (req, res) => {
    try {
      const data = await toolServices.generatePassword(req);

      return successResponse(res, 200, "Password generated successfully", data);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },
  // Password Strength Checker
  passwordStrength: async (req, res) => {
    try {
      const data = await toolServices.passwordStrength(req);

      return successResponse(
        res,
        200,
        "Password strength checked successfully",
        data,
      );
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  },

  // ##########################################
  // ##########   JWT     #####################
  // ##########################################
  // JWT Secret Generator
  generateJwtSecret: async (req, res) => {
    try {
      const data = await toolServices.generateJwtSecret(req);

      return successResponse(
        res,
        200,
        "JWT secret generated successfully",
        data,
      );
    } catch (error) {
      return errorResponse(
        res,
        500,
        error.message || "Failed to generate JWT secret.",
      );
    }
  },
  // JWT Decoder
  decodeJwt: async (req, res) => {
    try {
      const data = await toolServices.decodeJwt(req);

      return successResponse(res, 200, "JWT decoded successfully", data);
    } catch (error) {
      return errorResponse(res, 400, error.message || "Failed to decode JWT.");
    }
  },
  verifyJwt: async (req, res) => {
    try {
      const data = await toolServices.verifyJwt(req);
      return successResponse(res, 200, "JWT signature verified successfully", data);
    } catch (error) {
      return errorResponse(res, 400, error.message || "JWT verification failed.");
    }
  },
  // JWT Encoder
  encodeJwt: async (req, res) => {
    try {
      const data = await toolServices.encodeJwt(req);

      return successResponse(res, 200, "JWT generated successfully", data);
    } catch (error) {
      return errorResponse(
        res,
        400,
        error.message || "Failed to generate JWT.",
      );
    }
  },

  // ##########################################
  // ##########   Hasher     ##################
  // ##########################################
  // Basic Hash Generator
  generateBasicHash: async (req, res) => {
    try {
      const { text, costFactor } = req.body;

      const data = await toolServices.generateBasicHash(text, costFactor);

      return successResponse(
        res,
        200,
        "Basic hash generated successfully",
        data,
      );
    } catch (error) {
      return errorResponse(
        res,
        500,
        error.message || "Failed to generate basic hash.",
      );
    }
  },
  // Basic Hash Verifier
  verifyBasicHash: async (req, res) => {
    try {
      const { text, hash } = req.body;

      const data = await toolServices.verifyBasicHash(text, hash);

      return successResponse(
        res,
        200,
        data.isValid
          ? "Hash verified successfully"
          : "Hash verification failed",
        data,
      );
    } catch (error) {
      return errorResponse(
        res,
        500,
        error.message || "Failed to verify basic hash.",
      );
    }
  },
  // Salt Hash Generator
  generateSaltHash: async (req, res) => {
    try {
      const { text, salt, costFactor } = req.body;

      const data = await toolServices.generateSaltHash(text, salt, costFactor);

      return successResponse(
        res,
        200,
        "Salt hash generated successfully",
        data,
      );
    } catch (error) {
      return errorResponse(
        res,
        500,
        error.message || "Failed to generate salt hash.",
      );
    }
  },
  // Salt Hash Verifier
  verifySaltHash: async (req, res) => {
    try {
      const { text, salt, hash } = req.body;

      const data = await toolServices.verifySaltHash(text, salt, hash);

      return successResponse(
        res,
        200,
        data.isValid
          ? "Hash verified successfully"
          : "Hash verification failed",
        data,
      );
    } catch (error) {
      return errorResponse(
        res,
        500,
        error.message || "Failed to verify salt hash.",
      );
    }
  },
  // Salt + Pepper Hash Generator
  generateSaltPepperHash: async (req, res) => {
    try {
      const { text, salt, costFactor } = req.body;

      const data = await toolServices.generateSaltPepperHash(
        text,
        salt,
        costFactor,
      );

      return successResponse(
        res,
        200,
        "Salt + Pepper hash generated successfully",
        data,
      );
    } catch (error) {
      return errorResponse(
        res,
        500,
        error.message || "Failed to generate salt + pepper hash.",
      );
    }
  },
  // Salt + Pepper Hash Verifier
  verifySaltPepperHash: async (req, res) => {
    try {
      const { text, salt, hash } = req.body;

      const data = await toolServices.verifySaltPepperHash(text, salt, hash);

      return successResponse(
        res,
        200,
        data.isValid
          ? "Hash verified successfully"
          : "Hash verification failed",
        data,
      );
    } catch (error) {
      return errorResponse(
        res,
        500,
        error.message || "Failed to verify salt + pepper hash.",
      );
    }
  },
  // PasteBin
  pasteBin: async () => {},
  // File Share
  fileShare: async () => {},
};

export default toolControllers;
