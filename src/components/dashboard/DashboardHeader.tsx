"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-light text-black hover:text-gray-600 transition-colors"
        >
          ZeroGravity
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-black hover:bg-[#fafafa] text-sm border border-gray-300 px-4 py-2 hover:border-black transition-colors"
          >
            Home
          </Link>
          <button
            onClick={onLogout}
            className="text-white bg-black hover:bg-[#3e3e3e] hover:text-[#ededed] text-sm border px-4 py-2 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
