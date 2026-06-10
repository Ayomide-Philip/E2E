"use client";

import { motion, Variants } from "framer-motion";

export default function Home() {
  const handleStartChatting = () => {
    console.log("Start Chatting clicked");
  };

  const handleLearnMore = () => {
    console.log("Learn More clicked");
  };

  // Animation variants
  const floatingVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-white overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-50 dark:to-slate-100"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 md:px-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-black dark:text-black">
            Private
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-slate-600 dark:text-slate-600 hover:text-black dark:hover:text-black transition-colors"
          >
            How It Works
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-600 dark:text-slate-600 hover:text-black dark:hover:text-black transition-colors"
          >
            Security
          </a>
        </div>

        {/* CTA Button */}
        <button className="bg-black dark:bg-black text-white dark:text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-800 transition-colors">
          Start Chat
        </button>
      </nav>

      {/* Main Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-5xl w-full">
          {/* Hero Section with Floating Elements */}
          <div className="relative h-150 flex items-center justify-center">
            {/* Top Left - No Sign-up Card */}
            <motion.div
              className="absolute top-0 left-0 md:-left-25"
              initial="initial"
              animate="animate"
              variants={floatingVariants}
            >
              <div className="bg-white dark:bg-white rounded-2xl shadow-lg p-4 max-w-xs border border-slate-200 dark:border-slate-200">
                <div className="text-sm font-semibold text-black dark:text-black mb-1">
                  ✨ No Sign-up
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-600">
                  Start chatting instantly without creating an account
                </p>
              </div>
            </motion.div>

            {/* Top Right - Encrypted Card */}
            <motion.div
              className="absolute top-0 right-0 md:-right-25"
              initial="initial"
              animate="animate"
              variants={{
                ...floatingVariants,
                animate: {
                  y: [10, -10, 10],
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              }}
            >
              <div className="bg-white dark:bg-white rounded-2xl shadow-lg p-4 max-w-xs border border-slate-200 dark:border-slate-200">
                <div className="text-sm font-semibold text-black dark:text-black mb-1">
                  🔒 End-to-End Encrypted
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-600">
                  Messages are encrypted in your browser
                </p>
              </div>
            </motion.div>

            {/* Bottom Left - Room Card */}
            <motion.div
              className="absolute bottom-0 left-0 md:-left-20"
              initial="initial"
              animate="animate"
              variants={{
                ...floatingVariants,
                animate: {
                  y: [-15, 15, -15],
                  transition: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              }}
            >
              <div className="bg-white dark:bg-white rounded-2xl shadow-lg p-5 max-w-xs border border-slate-200 dark:border-slate-200">
                <div className="text-sm font-semibold text-black dark:text-black mb-2">
                  ✓ Room Created
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-600 mb-3">
                  Share the link with a friend
                </p>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 dark:from-blue-400 dark:to-blue-600" />
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-400 to-purple-600 dark:from-purple-400 dark:to-purple-600" />
                </div>
              </div>
            </motion.div>

            {/* Bottom Right - Auto-Delete Card */}
            <motion.div
              className="absolute bottom-0 right-0 md:-right-25"
              initial="initial"
              animate="animate"
              variants={floatingVariants}
            >
              <div className="bg-white dark:bg-white rounded-2xl shadow-lg p-4 max-w-xs border border-slate-200 dark:border-slate-200">
                <div className="text-sm font-semibold text-black dark:text-black mb-1">
                  🗑️ Auto-Delete
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-600">
                  Messages disappear when everyone leaves
                </p>
              </div>
            </motion.div>

            {/* Center Icon Above Headline */}
            <motion.div
              className="absolute -top-15 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { delay: 0.2, duration: 0.5 },
              }}
            >
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 dark:from-blue-500 dark:to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">🔐</span>
              </div>
            </motion.div>

            {/* Hero Content - Center */}
            <motion.div
              className="text-center relative z-20"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-black dark:text-black mb-6 leading-tight tracking-tight">
                Private conversations.
                <br />
                No accounts.
                <br />
                <span className="text-slate-400 dark:text-slate-400">
                  No trace.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Create a secure chat room, share the link, and start talking
                instantly. Messages are encrypted in your browser and disappear
                when the conversation ends.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <motion.button
                  onClick={handleStartChatting}
                  className="bg-black dark:bg-black text-white dark:text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-slate-800 dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Chatting
                </motion.button>

                <motion.button
                  onClick={handleLearnMore}
                  className="border-2 border-slate-300 dark:border-slate-300 text-black dark:text-black px-8 py-4 rounded-xl font-semibold text-base hover:bg-slate-100 dark:hover:bg-slate-100 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
