"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_ENDPOINTS, apiCall } from "@/config/api";

interface User {
  _id: string;
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  userId: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  signup: (
    userData: SignupData
  ) => Promise<{ success: boolean; message: string }>;
  checkSession: () => Promise<void>;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get userId from cookies (client-side)
  // const getUserIdFromCookies = (): string | null => {
  //   if (typeof window === "undefined") return null;

  //   const cookies = document.cookie.split(";");
  //   const userIdCookie = cookies.find((cookie) =>
  //     cookie.trim().startsWith("userId=")
  //   );

  //   if (userIdCookie) {
  //     return userIdCookie.split("=")[1];
  //   }

  //   return null;
  // };

  // Check session status on component mount and when needed
  const checkSession = async () => {
    try {
      setIsLoading(true);
      console.log("Checking session...");

      const response = await apiCall(API_ENDPOINTS.AUTH.SESSION_STATUS, {
        method: "GET",
      });

      const data = await response.json();
      console.log("Session check response:", data);

      if (data.success && data.isLoggedIn) {
        setUser(data.user);
        setUserId(data.userId);
        setIsLoggedIn(true);
        console.log("User logged in:", data.user);
      } else {
        setUser(null);
        setUserId(null);
        setIsLoggedIn(false);
        console.log("User not logged in");
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
      setUserId(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("Attempting login for:", email);
      const response = await apiCall(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        setUser(data.user);
        setUserId(data.userId);
        setIsLoggedIn(true);

        // Store token in localStorage as fallback for cookie issues
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        console.log("Login successful, user:", data.user);
        console.log("UserId:", data.userId);
        return { success: true, message: data.message };
      } else {
        console.log("Login failed:", data.message);
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          "Network error. Please check if the backend server is running.",
      };
    }
  };

  // Signup function
  const signup = async (
    userData: SignupData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiCall(API_ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setUserId(data.userId);
        setIsLoggedIn(true);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Signup failed" };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message:
          "Network error. Please check if the backend server is running.",
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiCall(API_ENDPOINTS.AUTH.LOGOUT, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setUserId(null);
      setIsLoggedIn(false);

      // Clear localStorage token
      localStorage.removeItem("authToken");
    }
  };

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Optional: Set up periodic session checking
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const value: AuthContextType = {
    user,
    userId,
    isLoggedIn,
    isLoading,
    login,
    logout,
    signup,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
