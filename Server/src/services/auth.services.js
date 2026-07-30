import { supabase } from "../config/supabase.js";
import { METHODS, ENDPOINTS } from "../utils/constants.js";
import logs from "../utils/logs.js";

const authServices = {
  // Signup
  Signup: async (channel) => {
    try {
      logs(`${METHODS.POST}${ENDPOINTS.SIGNUP} - Signup Flow Started`);

      const { fullName, email, password } = channel;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        logs(`${METHODS.POST}${ENDPOINTS.SIGNUP} - ${error.message}`, "ERROR");
        throw error;
      }

      logs(`${METHODS.POST}${ENDPOINTS.SIGNUP} - Signup Flow Ended`);
      console.log({
        user: {
          id: data.user.id,
          fullName: data.user.user_metadata.full_name,
          email: data.user.email,
        },
      });

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata.full_name,
        },
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in,
        },
      };
    } catch (error) {
      logs(
        `${METHODS.POST}${ENDPOINTS.SIGNUP} - Error: ${error.message}`,
        "ERROR",
      );
      throw error;
    }
  },
  // Login
  Login: async (channel) => {
    try {
      logs(`${METHODS.POST}${ENDPOINTS.LOGIN} - Login Flow Started`);

      const { email, password } = channel;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logs(`${METHODS.POST}${ENDPOINTS.LOGIN} - ${error.message}`, "ERROR");
        throw error;
      }

      logs(`${METHODS.POST}${ENDPOINTS.LOGIN} - Login Flow Ended`);
      console.log({
        user: {
          id: data.user.id,
          fullName: data.user.user_metadata.full_name,
          email: data.user.email,
        },
      });

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata.full_name,
        },
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in,
          tokenType: "Bearer",
        },
      };
    } catch (error) {
      logs(
        `${METHODS.POST}${ENDPOINTS.LOGIN} - Error: ${error.message}`,
        "ERROR",
      );
      throw error;
    }
  },
  // Current User
  Me: async (user) => {
    try {
      logs(`${METHODS.GET}${ENDPOINTS.GET_USER} - Fetch User Started`);
      const profile = {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata.full_name,
      };

      logs(`${METHODS.GET}${ENDPOINTS.GET_USER} - Fetch User Ended`);
      console.log(profile);
      return profile;
    } catch (error) {
      logs(
        `${METHODS.GET}${ENDPOINTS.GET_USER} - Error: ${error.message}`,
        "ERROR",
      );
      throw error;
    }
  },
  // Logout
  Logout: async (accessToken) => {
    try {
      logs(`${METHODS.POST}${ENDPOINTS.LOGOUT} - Logout Started`);

      const { error } = await supabase.auth.signOut(
        accessToken,
        "global",
      );

      if (error) {
        logs(`${METHODS.POST}${ENDPOINTS.LOGOUT} - ${error.message}`, "ERROR");
        throw error;
      }

      logs(`${METHODS.POST}${ENDPOINTS.LOGOUT} - Logout Ended`);
    } catch (error) {
      throw error;
    }
  },
};

export default authServices;
