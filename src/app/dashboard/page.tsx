"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          <h2 className="text-4xl font-light text-black mb-4">Dashboard</h2>
          <p className="text-gray-600 text-lg">
            Welcome to your ZeroGravity dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <h3 className="text-xl font-medium text-black mb-2">Projects</h3>
            <p className="text-gray-600 mb-4">Your ongoing projects</p>
            <p className="text-sm text-gray-500">No projects yet</p>
          </div>

          <div className="border border-gray-200 p-6 hover:border-black transition-colors">
            <h3 className="text-xl font-medium text-black mb-2">Settings</h3>
            <p className="text-gray-600 mb-4">Customize your experience</p>
            <p className="text-sm text-gray-500">Coming soon</p>
          </div>
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
