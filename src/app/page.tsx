import Image from "next/image";
import Link from "next/link";
import {
  AnimatedHeader,
  AnimatedHero,
  AnimatedHeroElement,
  AnimatedFeatureSection,
  AnimatedFeatureGrid,
  AnimatedFeatureItem,
  AnimatedSection,
  AnimatedCTA,
  AnimatedFooter,
} from "@/components/AnimatedSection";

export default function Home() {
  return (
    <div className="bg-white">
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
            <Link
              href="/signup"
              className="bg-black text-white px-2 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </AnimatedHeader>

      {/* Hero Section */}
      <main className="relative">
        {/* Background Image */}
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
                <Link
                  href="/signup"
                  className="bg-black text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto text-center"
                >
                  Get Started
                </Link>
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

        {/* Features Section */}
        <AnimatedFeatureSection className="max-w-6xl mx-auto px-8 lg:px-4 py-16 sm:py-24">
          <AnimatedSection className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-light text-black mb-4">
              Features
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Discover what makes ZeroGravity perfect
            </p>
          </AnimatedSection>

          <AnimatedFeatureGrid className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center mb-16 sm:mb-24">
            <AnimatedFeatureItem className="order-2 lg:order-1">
              <Image
                src="/landing/zerogravity_productivity.webp"
                alt="Goal Management Features"
                width={500}
                height={400}
                className="rounded-lg shadow-sm w-full"
              />
            </AnimatedFeatureItem>
            <AnimatedFeatureItem className="order-1 lg:order-2">
              <h3 className="text-2xl sm:text-3xl font-light text-black mb-4 sm:mb-6">
                Comprehensive Goal Management
              </h3>
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                Create, organize, and track your goals with flexible categories
                and detailed progress monitoring designed for personal and
                professional growth.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Create and edit goals with descriptions and notes
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Organize by categories
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Visual progress tracking and completion status
                </li>
              </ul>
            </AnimatedFeatureItem>
          </AnimatedFeatureGrid>

          <AnimatedFeatureGrid className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center mb-16 sm:mb-24">
            <AnimatedFeatureItem>
              <h3 className="text-2xl sm:text-3xl font-light text-black mb-4 sm:mb-6">
                Privacy & Control
              </h3>
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                Take full control of your goal visibility with flexible privacy
                settings that let you share what matters while keeping personal
                goals private.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Private or public goal visibility
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Toggle visibility per individual goal
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Secure personal workspace
                </li>
              </ul>
            </AnimatedFeatureItem>
            <AnimatedFeatureItem>
              <Image
                src="/landing/zerogravity_tasks.webp"
                alt="Privacy Controls"
                width={500}
                height={400}
                className="rounded-lg shadow-sm w-full"
              />
            </AnimatedFeatureItem>
          </AnimatedFeatureGrid>

          <AnimatedFeatureGrid className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center mb-16 sm:mb-24">
            <AnimatedFeatureItem className="order-2 lg:order-1">
              <Image
                src="/landing/zerogravity2.webp"
                alt="Progress Tracking"
                width={500}
                height={400}
                className="rounded-lg shadow-sm w-full"
              />
            </AnimatedFeatureItem>
            <AnimatedFeatureItem className="order-1 lg:order-2">
              <h3 className="text-2xl sm:text-3xl font-light text-black mb-4 sm:mb-6">
                Smart Progress Tracking
              </h3>
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                Monitor your journey with intuitive progress visualization,
                checklist functionality, and completion tracking that keeps you
                motivated.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Visual progress bars and percentage completion
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Basic checklist functionality
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Simple complete/incomplete tracking
                </li>
              </ul>
            </AnimatedFeatureItem>
          </AnimatedFeatureGrid>

          <AnimatedFeatureGrid className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <AnimatedFeatureItem>
              <h3 className="text-2xl sm:text-3xl font-light text-black mb-4 sm:mb-6">
                Smart Reminders & Deadlines
              </h3>
              <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                Stay on track with intelligent reminder systems, due date
                management, and countdown timers that help you meet your
                deadlines.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Set due dates and deadlines
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Points which push you further
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                  Days remaining countdown
                </li>
              </ul>
            </AnimatedFeatureItem>
            <AnimatedFeatureItem>
              <Image
                src="/landing/zerogravity3.webp"
                alt="Reminders and Notifications"
                width={500}
                height={400}
                className="rounded-lg shadow-sm w-full"
              />
            </AnimatedFeatureItem>
          </AnimatedFeatureGrid>
        </AnimatedFeatureSection>

        {/* Call to Action Section */}
        <AnimatedCTA className="bg-gray-50 py-16 sm:py-20">
          <AnimatedSection className="max-w-4xl mx-auto text-center px-4">
            <AnimatedSection className="relative mb-6 sm:mb-8">
              <Image
                src="/landing/zerogravity3.webp"
                alt="Join ZeroGravity"
                width={150}
                height={112}
                className="mx-auto opacity-20 w-32 h-24 sm:w-48 sm:h-36"
              />
            </AnimatedSection>
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-light text-black mb-4 sm:mb-6">
                Ready to Transform Your Goal Achievement?
              </h2>
            </AnimatedSection>
            <AnimatedSection>
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of users who have revolutionized their goal
                management with our minimalist, privacy-focused approach.
              </p>
            </AnimatedSection>
            <AnimatedSection>
              <Link
                href="/signup"
                className="bg-black text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium hover:bg-gray-800 transition-colors inline-block"
              >
                Start Your Journey
              </Link>
            </AnimatedSection>
          </AnimatedSection>
        </AnimatedCTA>
      </main>

      <AnimatedFooter className="border-t border-gray-200 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2025 ZeroGravity. Minimalist by design.
          </p>
        </div>
      </AnimatedFooter>
    </div>
  );
}
