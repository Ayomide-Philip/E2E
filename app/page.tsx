"use client";

import Toggle from "@/components/Toggle";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const handleStartChatting = () => {
    console.log("Start Chatting clicked");
  };

  const handleLearnMore = () => {
    console.log("Learn More clicked");
  };

  const socket = new WebSocket("ws://localhost:3000/api/ws");
  socket.onopen = () => {
    socket.send(JSON.stringify({ message: "Hello, server!", type: "message" }));
  };

  const floatingVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-linear-to-br dark:from-black dark:via-zinc-950 dark:to-black overflow-hidden">
      <div
        className="absolute inset-0 bg-linear-to-br from-white via-zinc-50 to-white dark:bg-linear-to-br dark:from-black dark:via-zinc-950 dark:to-black"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage:
            "radial-gradient(circle, #27272a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <nav className="sticky top-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-6xl items-center justify-between rounded-full px-6 py-4 md:px-8 bg-white/70 dark:bg-black/20 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            Private
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="#"
            className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Security
          </a>
          <Toggle />
        </div>

        <button className="bg-zinc-900 dark:bg-white/95 text-white dark:text-black px-5 py-2.5 rounded-full font-medium text-sm hover:bg-zinc-700 dark:hover:bg-white transition-colors shadow-sm shadow-black/20">
          Start Chat
        </button>
      </nav>

      <div className="relative z-10 flex items-center justify-center h-[calc(100vh-73px)] px-4">
        <div className="max-w-5xl w-full">
          <div className="relative h-full min-h-0 flex items-center justify-center">
            <motion.div
              className="hidden md:block absolute top-0 left-0 md:-left-8 lg:-left-12"
              initial="initial"
              animate="animate"
              variants={floatingVariants}
            >
              <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-lg shadow-zinc-200/80 dark:shadow-none p-3 max-w-47.5 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-semibold text-zinc-900 dark:text-white mb-1">
                  ✨ No Sign-up
                </div>
                <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                  Start chatting instantly without creating an account
                </p>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:block absolute top-0 right-0 md:-right-8 lg:-right-12"
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
              <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-lg shadow-zinc-200/80 dark:shadow-none p-3 max-w-47.5 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-semibold text-zinc-900 dark:text-white mb-1">
                  🔒 End-to-End Encrypted
                </div>
                <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                  Messages are encrypted in your browser
                </p>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:block absolute bottom-0 left-0 md:-left-6 lg:-left-10"
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
              <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-lg shadow-zinc-200/80 dark:shadow-none p-4 max-w-55 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-semibold text-zinc-900 dark:text-white mb-2">
                  ✓ Room Created
                </div>
                <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400 mb-3">
                  Share the link with a friend
                </p>
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-full bg-linear-to-br from-blue-500 to-blue-700" />
                  <div className="h-7 w-7 rounded-full bg-linear-to-br from-purple-500 to-purple-700" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:block absolute bottom-0 right-0 md:-right-8 lg:-right-12"
              initial="initial"
              animate="animate"
              variants={floatingVariants}
            >
              <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-lg shadow-zinc-200/80 dark:shadow-none p-3 max-w-52.5 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-semibold text-zinc-900 dark:text-white mb-1">
                  🗑️ Auto-Delete
                </div>
                <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                  Messages disappear when everyone leaves
                </p>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:block absolute -top-16 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { delay: 0.2, duration: 0.5 },
              }}
            >
              <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20">
                <span className="text-2xl">🔐</span>
              </div>
            </motion.div>

            <motion.div
              className="text-center relative z-20"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-5 leading-[1.02] tracking-tight">
                Private conversations.
                <br />
                No accounts.
                <br />
                <span className="text-zinc-400 dark:text-zinc-500">
                  No trace.
                </span>
              </h1>

              <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Create a secure chat room, share the link, and start talking
                instantly. Messages are encrypted in your browser and disappear
                when the conversation ends.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <motion.button
                  onClick={handleStartChatting}
                  className="bg-zinc-900 dark:bg-white text-white dark:text-black px-7 py-3.5 rounded-xl font-semibold text-sm md:text-base hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/20 dark:hover:shadow-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Chatting
                </motion.button>

                <motion.button
                  onClick={handleLearnMore}
                  className="border-2 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white px-7 py-3.5 rounded-xl font-semibold text-sm md:text-base hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300"
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
