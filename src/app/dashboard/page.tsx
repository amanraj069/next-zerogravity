"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS, apiCall, apiCallWithAuth } from "@/config/api";

interface WaitlistUser {
  _id?: string;
  id: string;
  name: string;
  email: string;
  createdAt: string;
  joinedAt: string;
  isNotified: boolean;
}

export default function Dashboard() {
  const { user, logout, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(false);
  const [signupToggleLoading, setSignupToggleLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    } else if (isLoggedIn) {
      // Fetch waitlist data after successful auth
      fetchWaitlistUsers();
      fetchSignupStatus();
    }
  }, [isLoggedIn, authLoading, router]);

  const fetchWaitlistUsers = async () => {
    setWaitlistLoading(true);
    try {
      const response = await apiCallWithAuth(API_ENDPOINTS.WAITLIST.LIST);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWaitlistUsers(data.data.entries);
        }
      }
    } catch (err) {
      console.error("Failed to fetch waitlist users:", err);
    } finally {
      setWaitlistLoading(false);
    }
  };

  const fetchSignupStatus = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.AUTH.SIGNUP_STATUS);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSignupEnabled(data.enabled);
        }
      }
    } catch (err) {
      console.error("Failed to fetch signup status:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleSignup = async () => {
    setSignupToggleLoading(true);
    try {
      const response = await apiCallWithAuth(API_ENDPOINTS.AUTH.TOGGLE_SIGNUP, {
        method: "POST",
        body: JSON.stringify({ enabled: !signupEnabled }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSignupEnabled(!signupEnabled);
        }
      } else {
        console.error(
          "Toggle signup failed:",
          response.status,
          response.statusText
        );
      }
    } catch (err) {
      console.error("Failed to toggle signup:", err);
    } finally {
      setSignupToggleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-light text-black hover:text-gray-600 transition-colors"
          >
            ZeroGravity
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, {user?.firstName || user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-black hover:text-gray-600 text-sm border border-gray-300 px-3 py-1 hover:border-black transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {/* <h2 className="text-4xl font-light text-black mb-4">Dashboard</h2> */}
          {/* <p className="text-gray-600 text-lg">
            Welcome to your ZeroGravity dashboard
          </p> */}
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 p-6 hover:border-black transition-colors">
            <h3 className="text-xl font-medium text-black mb-2">Profile</h3>
            <p className="text-gray-600 mb-4">Manage your account settings</p>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Name:</span> {user?.firstName}{" "}
                {user?.lastName}
              </p>
              <p>
                <span className="font-medium">Username:</span> {user?.username}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
            </div>
          </div>

          <div className="border border-gray-200 p-6 hover:border-black transition-colors">
            <h3 className="text-xl font-medium text-black mb-2">
              Waitlist Users
            </h3>
            <p className="text-gray-600 mb-4">
              Users who have joined the waitlist
            </p>
            {waitlistLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : waitlistUsers.length > 0 ? (
              <p className="text-sm text-gray-700">
                {waitlistUsers.length} user
                {waitlistUsers.length !== 1 ? "s" : ""} registered
              </p>
            ) : (
              <p className="text-sm text-gray-500">No users yet</p>
            )}
          </div>

          <div className="border border-gray-200 p-6 hover:border-black transition-colors">
            <h3 className="text-xl font-medium text-black mb-2">Settings</h3>
            <p className="text-gray-600 mb-4">Customize your experience</p>
            <p className="text-sm text-gray-500">Coming soon</p>
          </div>
        </div> */}

        {/* Signup Toggle Section */}
        <div className="mt-12">
          <div className="border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h3 className="text-xl font-medium text-black mb-2">
                  Signup Settings
                </h3>
                <p className="text-gray-600 text-sm">
                  Enable User registration on the signup page
                </p>
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={toggleSignup}
                  disabled={signupToggleLoading}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                    signupEnabled ? "bg-black" : "bg-gray-200"
                  } ${
                    signupToggleLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      signupEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist Users Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-light text-black">
              Waitlist Users ({waitlistUsers.length})
            </h3>
            <button
              onClick={fetchWaitlistUsers}
              className="text-black hover:text-gray-600 text-sm border border-gray-300 px-3 py-1 hover:border-black transition-colors"
              disabled={waitlistLoading}
            >
              {waitlistLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {waitlistUsers.length > 0 ? (
            <div className="border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Email
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {waitlistUsers.map((user, index) => (
                      <tr key={user._id || index} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500 sm:hidden truncate">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                          {user.email}
                        </td>
                        <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">
                          <div className="sm:whitespace-nowrap">
                            <span className="hidden sm:inline">
                              {new Date(user.joinedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <span className="sm:hidden">
                              {new Date(user.joinedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 sm:hidden">
                            {new Date(user.joinedAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-4 text-center">
                          <span
                            className={`inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isNotified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.isNotified ? "✓" : "○"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-lg">No waitlist users yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Users who join the waitlist will appear here
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-gray-500 hover:text-black">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
