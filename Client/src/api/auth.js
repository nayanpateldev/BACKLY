import apiService from "./apiservice";

const authApi = {

  signup: (data) =>
    apiService.post("/auth/signup", data),

  login: (data) =>
    apiService.post("/auth/login", data),

  logout: () =>
    apiService.post("/auth/logout"),

  me: () =>
    apiService.get("/auth/getUser"),
};

export default authApi;