"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waitlistUsers, setWaitlistUsers] = useState<any[]>([]);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          // Fetch waitlist data after successful auth
          fetchWaitlistUsers();
        } else {
          window.location.href = "/login";
        }
      } else {
        // Redirect to login if not authenticated
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWaitlistUsers = async () => {
    setWaitlistLoading(true);
    try {
      const response = await fetch("http://localhost:9000/api/waitlist/list", {
        credentials: "include",
      });

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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:9000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-light text-black">ZeroGravity</h1>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Sent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {waitlistUsers.map((user, index) => (
                      <tr key={user._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joinedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isNotified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.isNotified ? "Yes" : "No"}
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
