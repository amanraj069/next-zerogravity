"use client";

import Link from "next/link";
import { AnimatedHeader } from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingNavbar() {
  const { isLoggedIn, isLoading, logout } = useAuth();
  return (
    <AnimatedHeader className="border-b border-gray-200 bg-white relative z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-light text-black hover:text-gray-600 transition-colors"
        >
          ZeroGravity
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/goals"
                    className="text-gray-600 hover:text-black text-xs sm:text-sm px-2 sm:px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Goals
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-black text-xs sm:text-sm px-2 sm:px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-black text-white px-2 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-800 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-black hover:text-gray-800 text-xs sm:text-sm border border-gray-300 px-2 sm:px-4 py-2 hover:border-black transition-colors"
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => {
                      document.getElementById("waitlist")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="bg-black text-white px-2 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-800 transition-colors"
                  >
                    Join Waitlist
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </AnimatedHeader>
  );
}
