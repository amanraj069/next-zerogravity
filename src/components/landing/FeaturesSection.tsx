"use client";

import Image from "next/image";
import {
  AnimatedFeatureSection,
  AnimatedFeatureGrid,
  AnimatedFeatureItem,
  AnimatedSection,
} from "@/components/AnimatedSection";

export default function FeaturesSection() {
  return (
    <AnimatedFeatureSection className="max-w-6xl mx-auto px-12 lg:px-8 py-12 sm:py-16 lg:py-24">
      <AnimatedSection className="text-center mb-8 sm:mb-12 lg:mb-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-3 sm:mb-4">
          Everything You Need to Achieve Your Dreams
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2">
          Discover what makes ZeroGravity perfect
        </p>
      </AnimatedSection>

      <AnimatedFeatureGrid className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-24">
        <AnimatedFeatureItem className="order-2 lg:order-1">
          <Image
            src="/landing/zerogravity_productivity.webp"
            alt="Goal Management Features"
            width={500}
            height={400}
            className="rounded-lg shadow-sm w-full h-auto"
          />
        </AnimatedFeatureItem>
        <AnimatedFeatureItem className="order-1 lg:order-2 space-y-3 sm:space-y-4 lg:space-y-6">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-black">
            Master Your Goals with Precision
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Transform ambitious dreams into achievable milestones. Our
            comprehensive goal management system adapts to your unique journey,
            whether you&apos;re building a career, learning new skills, or
            pursuing personal growth.
          </p>
          <ul className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm lg:text-base">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>
                Create detailed goals with rich descriptions, notes, and context
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>
                Smart categorization for work, health, relationships, and more
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>
                Real-time progress visualization that celebrates every step
                forward
              </span>
            </li>
          </ul>
        </AnimatedFeatureItem>
      </AnimatedFeatureGrid>

      <AnimatedFeatureGrid className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-24">
        <AnimatedFeatureItem className="space-y-3 sm:space-y-4 lg:space-y-6">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-black">
            Stay Motivated with Intelligent Insights
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Watch your progress come alive with beautiful visualizations that
            make every achievement feel rewarding. Our smart tracking system
            learns from your patterns to keep you engaged and motivated.
          </p>
          <ul className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm lg:text-base">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>Dynamic progress bars with milestone celebrations</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>Interactive checklists that break down complex goals</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>Achievement streaks and momentum tracking</span>
            </li>
          </ul>
        </AnimatedFeatureItem>
        <AnimatedFeatureItem>
          <Image
            src="/landing/zerogravity-goal.webp"
            alt="Progress Tracking"
            width={500}
            height={400}
            className="rounded-lg shadow-sm w-full h-auto"
          />
        </AnimatedFeatureItem>
      </AnimatedFeatureGrid>

      <AnimatedFeatureGrid className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-24">
        <AnimatedFeatureItem className="order-2 lg:order-1">
          <Image
            src="/landing/zerogravity-meditate.webp"
            alt="Reminders and Notifications"
            width={500}
            height={400}
            className="rounded-lg shadow-sm w-full h-auto"
          />
        </AnimatedFeatureItem>
        <AnimatedFeatureItem className="space-y-3 sm:space-y-4 lg:space-y-6 order-1 lg:order-2">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-black">
            Never Miss a Moment
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Transform procrastination into progress with our intelligent
            reminder system. Get gentle nudges at the perfect moments, earn
            motivation points, and feel the excitement build as deadlines
            approach.
          </p>
          <ul className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm lg:text-base">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>Smart deadline management with flexible scheduling</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>Earn momentum points that fuel your motivation</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>Visual countdown timers that create positive urgency</span>
            </li>
          </ul>
        </AnimatedFeatureItem>
      </AnimatedFeatureGrid>

      <AnimatedFeatureGrid className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-24">
        <AnimatedFeatureItem className="space-y-3 sm:space-y-4 lg:space-y-6">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-black">
            Complete Privacy Control, Total Freedom
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Your journey, your choice. Decide what to share and what to keep
            private with granular control over every goal. Build confidence in
            your personal space while celebrating achievements with others when
            you&apos;re ready.
          </p>
          <ul className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm lg:text-base">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>Flexible privacy settings for each individual goal</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>One-click toggle between private and public sharing</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>
                Secure, encrypted personal workspace for sensitive goals
              </span>
            </li>
          </ul>
        </AnimatedFeatureItem>
        <AnimatedFeatureItem>
          <Image
            src="/landing/zerogravity-flex.webp"
            alt="Privacy Controls"
            width={500}
            height={400}
            className="rounded-lg shadow-sm w-full h-auto"
          />
        </AnimatedFeatureItem>
      </AnimatedFeatureGrid>

      <AnimatedFeatureGrid className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center mb-12">
        <AnimatedFeatureItem className="order-2 lg:order-1">
          <Image
            src="/landing/zerogravity-community.webp"
            alt="Community Features"
            width={500}
            height={400}
            className="rounded-lg shadow-sm w-full h-auto"
          />
        </AnimatedFeatureItem>
        <AnimatedFeatureItem className="order-1 lg:order-2 space-y-3 sm:space-y-4 lg:space-y-6">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-black">
            Find Your Tribe, Amplify Your Success
          </h3>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Connect with like-minded individuals, share your achievements, and
            find motivation through a supportive community that celebrates
            progress and encourages growth.
          </p>
          <ul className="space-y-2 sm:space-y-3 text-gray-600 text-xs sm:text-sm lg:text-base">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>Connect through shared goals and mutual inspiration</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>
                Discover new possibilities through others&apos; success stories
              </span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span>
                Build meaningful accountability partnerships that last
              </span>
            </li>
          </ul>
        </AnimatedFeatureItem>
      </AnimatedFeatureGrid>
    </AnimatedFeatureSection>
  );
}
