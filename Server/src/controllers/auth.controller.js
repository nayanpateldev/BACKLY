import authServices from "../services/auth.services.js";
import logs from "../utils/logs.js";
import { METHODS, ENDPOINTS } from "../utils/constants.js";
import { successResponse, errorResponse } from "../utils/response.js";

const authControllers = {
  // Signup
  handleSignup: async (req, res) => {
    try {
      logs(`${METHODS.POST}${ENDPOINTS.SIGNUP} - Request Recieved`);
      const data = req.body;
      const result = await authServices.Signup(data);
      logs(`${METHODS.POST}${ENDPOINTS.SIGNUP} - Request Ended`);

      res.cookie("accessToken", result.session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: result.session.expiresIn * 1000,
      });

      res.cookie("refreshToken", result.session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      delete result.session;

      return successResponse(res, 201, "User created successfully", result);
    } catch (error) {
      return errorResponse(
        res,
        error.status || 500,
        error.message || "Internal Server Error",
      );
    }
  },
  // Login
  handleLogin: async (req, res) => {
    try {
      logs(`${METHODS.POST}${ENDPOINTS.LOGIN} - Request Recieved`);
      const data = req.body;
      const authData = await authServices.Login(data);
      logs(`${METHODS.POST}${ENDPOINTS.LOGIN} - Request Ended`);
      res.cookie("accessToken", authData.session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: authData.session.expiresIn * 1000,
      });

      res.cookie("refreshToken", authData.session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      delete authData.session;

      return successResponse(res, 201, "User logged in successfully", authData);
    } catch (error) {
      return errorResponse(
        res,
        error.status || 500,
        error.message || "Internal Server Error",
      );
    }
  },
  // Current User
  handleMe: async (req, res) => {
    try {
      logs(`${METHODS.GET}${ENDPOINTS.GET_USER} - Request Received`);

      const user = await authServices.Me(req.user);

      logs(`${METHODS.GET}${ENDPOINTS.GET_USER} - Request Ended`);

      return successResponse(res, 200, "User fetched successfully", user);
    } catch (error) {
      return errorResponse(
        res,
        error.status || 500,
        error.message || "Internal Server Error",
      );
    }
  },
  // Logout
  handleLogout: async (req, res) => {
    try {
      logs(`${METHODS.POST}${ENDPOINTS.LOGOUT} - Request Received`);

      const bearerToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null;
      const token = bearerToken || req.cookies?.accessToken;

      // Server-side revocation is best effort. Cookie clearing must still work
      // when a session has already expired or the token is malformed.
      if (token) {
        try {
          await authServices.Logout(token);
        } catch (error) {
          logs(`${METHODS.POST}${ENDPOINTS.LOGOUT} - ${error.message}`, "WARN");
        }
      }

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      logs(`${METHODS.POST}${ENDPOINTS.LOGOUT} - Request Ended`);

      return successResponse(res, 200, "User logged out successfully");
    } catch (error) {
      return errorResponse(
        res,
        error.status || 500,
        error.message || "Internal Server Error",
      );
    }
  },
};

export default authControllers;
