"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Signup() {
  const router = useRouter();
  const [signupEnabled, setSignupEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkSignupStatus();
  }, []);

  const checkSignupStatus = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/api/auth/signup-status"
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSignupEnabled(data.enabled);
        }
      }
    } catch (err) {
      console.error("Failed to check signup status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please check if the backend server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleJoinWaitlist = () => {
    router.push("/");
    // Wait for navigation to complete, then scroll to waitlist section
    setTimeout(() => {
      const waitlistElement = document.getElementById("waitlist");
      if (waitlistElement) {
        waitlistElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  // Show waitlist message when signup is disabled
  if (!signupEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-6 sm:p-8 text-center">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-light text-black mb-2">
              Sign Up Currently Unavailable
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Account creation is temporarily disabled. Please join our waitlist
              to be notified when registration opens.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleJoinWaitlist}
              className="w-full bg-black text-white py-2.5 sm:py-3 px-4 font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Join Waitlist
            </button>

            <p className="text-sm sm:text-base text-gray-600">
              Are you an Admin?{" "}
              <Link
                href="/login"
                className="text-black hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-gray-500 hover:text-black text-xs sm:text-sm"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show signup form when signup is enabled
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-black mb-2">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Join ZeroGravity and start your productivity journey
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:border-black focus:outline-none text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:border-black focus:outline-none text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:border-black focus:outline-none text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Setup your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:border-black focus:outline-none text-sm sm:text-base"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2.5 sm:py-3 px-4 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm sm:text-base text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-black hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>

          <Link
            href="/"
            className="block text-gray-500 hover:text-black text-xs sm:text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
