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
      const user = await authServices.Signup(data);
      logs(`${METHODS.POST}${ENDPOINTS.SIGNUP} - Request Ended`);
      return successResponse(res, 201, "User created successfully", user);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
    }
  },
  // Login
  handleLogin: async (req, res) => {
    try {
      logs(`${METHODS.POST}${ENDPOINTS.LOGIN} - Request Recieved`);
      const data = req.body;
      const authData = await authServices.Login(data);
      logs(`${METHODS.POST}${ENDPOINTS.LOGIN} - Request Ended`);
      return successResponse(res, 201, "User logged in successfully", authData);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
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
      return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
    }
  },
  // Logout
  handleLogout: async (req, res) => {
    try {
      logs(`${METHODS.POST}${ENDPOINTS.LOGOUT} - Request Received`);

      const token = req.token;

      const user = {
        id: req.user.id,
        email: req.user.email,
        fullName: req.user.user_metadata.full_name,
      };

      await authServices.Logout(token);

      logs(`${METHODS.POST}${ENDPOINTS.LOGOUT} - Request Ended`);

      return successResponse(res, 200, "User logged out successfully", user);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
    }
  },
};

export default authControllers;
