import axios from "axios";
import { BASE_URL } from "./apiPath"; // Make sure BASE_URL = "http://localhost:8000/api"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: add token automatically
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

// Response interceptor: handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message || "";

      switch (status) {
        case 401:
          console.warn("Unauthorized! Redirecting to login.");
          window.location.href = "/";
          break;
        case 404:
          console.error("Not Found:", serverMessage);
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

// -----------------------------
// Usage examples (call directly from React component)
// -----------------------------

// 1️⃣ Add questions to a session
export const addQuestionsToSession = async (sessionId, questions) => {
  try {
    const res = await axiosInstance.post("/api/questions/add", { sessionId, questions });
    console.log("Questions added:", res.data);
    return res.data;
  } catch (err) {
    console.error("Add Questions Error:", err.response?.data || err.message);
    throw err;
  }
};

export const updateQuestionNote = async (questionId, note) => {
  try {
    const res = await axiosInstance.put(`/api/questions/${questionId}/note`, { note });
    console.log("Note updated:", res.data);
    return res.data;
  } catch (err) {
    console.error("Update Note Error:", err.response?.data || err.message);
    throw err;
  }
};

export const togglePinQuestion = async (questionId) => {
  try {
    const res = await axiosInstance.put(`/api/questions/${questionId}/pin`);
    console.log("Pin toggled:", res.data);
    return res.data;
  } catch (err) {
    console.error("Toggle Pin Error:", err.response?.data || err.message);
    throw err;
  }
};

/*
✅ Changes made:
1. Corrected all endpoints: added `/questions` prefix to match backend.
2. Added response interceptor handling for 404 (Not Found) errors.
3. Added usage examples inline so you can call functions directly from React without a new helper file.
4. All functions now use the same axiosInstance with Authorization token included automatically.
*/
