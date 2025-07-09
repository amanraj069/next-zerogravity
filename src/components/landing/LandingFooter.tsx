"use client";

import { AnimatedFooter } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();
  const [windowWidth, setWindowWidth] = useState(1200);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const floatingParticles = Array.from({ length: 3 }, (_, i) => i);

  return (
    <AnimatedFooter className="relative overflow-hidden bg-gradient-to-br from-slate-950 to-black border-t border-gray-800">
      <div className="absolute inset-0 overflow-hidden">
        {isClient &&
          floatingParticles.map((i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-20"
              initial={{
                x: Math.random() * windowWidth,
                y: Math.random() * 200,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-4 lg:py-6">
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-8 mb-2">
          <div className="text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-2"
            >
              <h3 className="text-xl sm:text-xl font-semibold text-white">
                ZeroGravity
              </h3>
              <p className="text-gray-400 text-sm mt-1 sm:mt-1">
                Break free from gravity. Reach your goals.
              </p>
            </motion.div>
          </div>

          <div className="flex justify-center sm:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex space-x-4 items-center">
                <motion.a
                  href="https://www.linkedin.com/in/amanraj-iiits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-8 sm:h-8 bg-gray-800/50 hover:bg-blue-600/80 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="LinkedIn"
                >
                  <svg
                    className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    style={{ display: "block" }}
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>

                <motion.a
                  href="mailto:amanraj3567@gmail.com"
                  className="w-10 h-10 sm:w-8 sm:h-8 bg-gray-800/50 hover:bg-red-600/80 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Email"
                >
                  <svg
                    className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    style={{ display: "block" }}
                  >
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.946l9.418 7.09 9.418-7.09h.946A1.636 1.636 0 0 1 24 5.457z" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-2 sm:mb-4"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-gray-500 text-xs sm:text-sm px-4 sm:px-0">
            © {currentYear} ZeroGravity.
          </p>
        </motion.div>
      </div>
    </AnimatedFooter>
  );
}
