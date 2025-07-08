"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 py-4">
        {children}

        {/* <div className="mt-12 text-center">
          <Link href="/" className="text-gray-500 hover:text-black">
            ← Back to home
          </Link>
        </div> */}
      </main>
    </div>
  );
}
