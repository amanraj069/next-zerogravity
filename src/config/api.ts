// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:9000";

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
    DEBUG: `${API_BASE_URL}/api/auth/debug`,
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
    credentials: "include", // This is crucial for sending cookies cross-origin
    mode: "cors", // Explicitly set CORS mode
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API call to: ${url}`, {
      method: defaultOptions.method || "GET",
      credentials: defaultOptions.credentials,
      headers: defaultOptions.headers,
    });

    const response = await fetch(url, defaultOptions);

    console.log(`API response status: ${response.status}`, {
      url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// Helper function for making API calls with token in header as fallback
export const apiCallWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  // First try with cookies
  let response = await apiCall(url, options);

  // If we get 401 and we have a token in localStorage, try with Authorization header
  if (response.status === 401) {
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("Retrying with Authorization header...");
      const authOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      };
      response = await apiCall(url, authOptions);
    }
  }

  return response;
};

export default API_BASE_URL;
