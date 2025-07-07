import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("[API ERROR] Unauthorized! Redirecting to login...");
        
        // Tokenları temizle
        clearAuthTokens();

        // Login page'e yönlendir
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions
function clearAuthTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
}

function redirectToLogin() {
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
}

const apiClient = {
  async request(method, url, data = null, headers = {}) {
    try {
      const response = await axiosInstance({ method, url, data, headers });
      return response.data;
    } catch (error) {
      return apiClient.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      console.error(`[API ERROR] ${error.response.status}: ${error.response.data.detail || error.message}`);
      throw new Error(error.response.data.detail || "An error occurred.");
    } else if (error.request) {
      console.error("[API ERROR] No response from server");
      throw new Error("No response from server.");
    } else {
      console.error("[API ERROR] Request failed:", error.message);
      throw new Error("Request failed.");
    }
  }
};

export default apiClient;
