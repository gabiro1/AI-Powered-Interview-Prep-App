import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message || "";

      switch (status) {
        case 401:
          console.warn("Unauthorized! Redirecting to login.");
          window.location.href = "/";
          break;
        case 500:
          console.error("Server error: ", serverMessage || "Internal Server Error");
          break;
        default:
          console.warn(`Error ${status}:`, serverMessage);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Please try again later.");
    } else {
      console.error("Unexpected error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
