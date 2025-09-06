"use client";

import React from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

interface ZeroGravityLoadingProps {
  title?: string;
  subtitle?: string;
  showNavigation?: boolean;
}

export default function ZeroGravityLoading({
  title = "ZeroGravity",
  subtitle = "Preparing your cosmic experience...",
  showNavigation = true,
}: ZeroGravityLoadingProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showNavigation && <LandingNavbar />}

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 border-b-2 border-black mb-6"></div>
          <h2 className="text-xl font-light text-black mb-2">{title}</h2>
          <p className="text-gray-600 font-light">{subtitle}</p>
        </div>
      </main>

      {showNavigation && <LandingFooter />}
    </div>
  );
}
