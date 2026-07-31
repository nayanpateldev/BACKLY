import toolServices from "../services/tools.services.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { generateShortUrl } from "../utils/url.js";

const toolControllers = {
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
      const data = await toolServices.redirectUrl(req, res);
      return res.redirect(data.original_url);
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
  pasteBin: async () => {},
  fileShare: async () => {},
};

export default toolControllers;
