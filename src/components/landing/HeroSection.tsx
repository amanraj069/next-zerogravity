"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatedHero,
  AnimatedHeroElement,
} from "@/components/AnimatedSection";

export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing/zerogravity_bg.webp"
          alt="ZeroGravity Background"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      <AnimatedHero className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <AnimatedHeroElement>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-black mb-4 sm:mb-6">
            ZeroGravity
          </h1>
        </AnimatedHeroElement>
        <AnimatedHeroElement>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Break free from gravity. Reach your goals.
          </p>
        </AnimatedHeroElement>
        <AnimatedHeroElement>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
            <button
              onClick={() => {
                document.getElementById("waitlist")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="bg-black text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto text-center"
            >
              Get Started
            </button>
            <Link
              href="/login"
              className="border border-gray-300 text-black px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-medium hover:border-black transition-colors w-full sm:w-auto text-center"
            >
              Sign In
            </Link>
          </div>
        </AnimatedHeroElement>
      </AnimatedHero>
    </div>
  );
}
