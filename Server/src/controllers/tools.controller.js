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
  pasteBin: async () => {},
  qr: async () => {},
  fileShare: async () => {},
  authKit: async () => {},
};

export default toolControllers;
