"use client";

import { motion } from "framer-motion";
import { LogIn, ArrowRight, Hash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/navbar";
import CreateRoomCard from "@/components/group/create/createRoomCard";
import CreateRoomModal from "@/components/group/create/roomModal";

function JoinRoomCard() {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleJoin() {
    const trimmed = roomId.trim();
    if (!trimmed) {
      setError("Please enter a room ID");
      return;
    }
    if (trimmed.length < 6) {
      setError("Room ID must be at least 6 characters");
      return;
    }
    setError("");
    router.push(`/chat/${trimmed}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl p-6 sm:p-8 hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/30 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5 dark:from-purple-500/10 dark:via-transparent dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 group-hover:scale-110 transition-all duration-500">
          <LogIn className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          Join Room
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
          Have a room ID? Enter it below to join an existing secure chat room.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Enter room ID..."
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className={`w-full rounded-xl border bg-white/50 dark:bg-zinc-900/50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                error
                  ? "border-red-300 dark:border-red-800 focus:ring-red-400/50"
                  : "border-zinc-200 dark:border-zinc-700 focus:ring-purple-500/50 focus:border-purple-400 dark:focus:border-purple-600"
              }`}
            />
          </div>
          <motion.button
            onClick={handleJoin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md shadow-purple-500/25"
          >
            <ArrowRight className="h-4 w-4" />
            Join
          </motion.button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default function GroupPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "radial-gradient(circle, #27272a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <NavBar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-10 sm:pt-7">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
            Groups
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Create or join secure, end-to-end encrypted chat rooms. Share a link
            and start a private conversation with anyone — no account needed.
          </p>
        </motion.div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
          <CreateRoomCard onCreateRoom={() => setModalOpen(true)} />
          <JoinRoomCard />
        </section>
      </main>

      <CreateRoomModal
        key={modalOpen ? "open" : "closed"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
