"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Goals from "@/components/goals/Goals";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

function GoalsContent() {
  return <Goals />;
}

function GoalsLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Suspense fallback={<GoalsLoadingFallback />}>
          <GoalsContent />
        </Suspense>
      </main>
      <LandingFooter />
    </div>
  );
}
