"use client";

import Link from "next/link";
import { AnimatedHeader } from "@/components/AnimatedSection";

export default function LandingNavbar() {
  return (
    <AnimatedHeader className="border-b border-gray-200 bg-white relative z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-light text-black">
          ZeroGravity
        </h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link
            href="/login"
            className="text-black hover:text-gray-600 text-xs sm:text-sm border border-gray-300 px-2 sm:px-4 py-2 hover:border-black transition-colors"
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
        </div>
      </div>
    </AnimatedHeader>
  );
}
