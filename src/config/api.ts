// API configuration
const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:9000";

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SESSION_STATUS: `${API_BASE_URL}/api/auth/session-status`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    SIGNUP_STATUS: `${API_BASE_URL}/api/auth/signup-status`,
    TOGGLE_SIGNUP: `${API_BASE_URL}/api/auth/toggle-signup`,
  },
  // Waitlist endpoints
  WAITLIST: {
    LIST: `${API_BASE_URL}/api/waitlist/list`,
    COUNT: `${API_BASE_URL}/api/waitlist/count`,
    JOIN: `${API_BASE_URL}/api/waitlist/join`,
  },
};

// Helper function for making API calls with consistent error handling
export const apiCall = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export default API_BASE_URL;
