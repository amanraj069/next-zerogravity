"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Goals from "@/components/goals/Goals";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import ZeroGravityLoading from "@/components/ZeroGravityLoading";

function GoalsContent() {
  return <Goals />;
}

function GoalsLoadingFallback() {
  return (
    <ZeroGravityLoading
      title="Loading Goals"
      subtitle="Preparing your cosmic journey..."
    />
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
      <ZeroGravityLoading
        title="Authenticating"
        subtitle="Verifying your cosmic credentials..."
      />
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
