import axios from "axios";

const apiService = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 20000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiService;
