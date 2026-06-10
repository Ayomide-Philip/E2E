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
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black"
        style={{
          backgroundImage:
            "radial-gradient(circle, #27272a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-6 md:px-16 bg-black/30 backdrop-blur-md border-b border-zinc-800/20">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Private</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="#"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Security
          </a>
        </div>

        {/* CTA Button */}
        <button className="bg-white text-black px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-zinc-100 transition-colors">
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
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-4 max-w-xs border border-zinc-800">
                <div className="text-sm font-semibold text-white mb-1">
                  ✨ No Sign-up
                </div>
                <p className="text-xs text-zinc-400">
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
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-4 max-w-xs border border-zinc-800">
                <div className="text-sm font-semibold text-white mb-1">
                  🔒 End-to-End Encrypted
                </div>
                <p className="text-xs text-zinc-400">
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
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-5 max-w-xs border border-zinc-800">
                <div className="text-sm font-semibold text-white mb-2">
                  ✓ Room Created
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Share the link with a friend
                </p>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700" />
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700" />
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
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-4 max-w-xs border border-zinc-800">
                <div className="text-sm font-semibold text-white mb-1">
                  🗑️ Auto-Delete
                </div>
                <p className="text-xs text-zinc-400">
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20">
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
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
                Private conversations.
                <br />
                No accounts.
                <br />
                <span className="text-zinc-500">No trace.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base md:text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Create a secure chat room, share the link, and start talking
                instantly. Messages are encrypted in your browser and disappear
                when the conversation ends.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <motion.button
                  onClick={handleStartChatting}
                  className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-base hover:bg-zinc-100 transition-all duration-300 hover:shadow-xl hover:shadow-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Chatting
                </motion.button>

                <motion.button
                  onClick={handleLearnMore}
                  className="border-2 border-zinc-700 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-zinc-900/50 hover:border-zinc-600 transition-all duration-300"
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
