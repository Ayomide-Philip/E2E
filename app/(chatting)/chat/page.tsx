"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, ArrowRight, Lock, Sparkles } from "lucide-react";
import generateRoomId from "@/lib/generatingRoomId";
import NavBar from "@/components/navbar";

export default function ChatLandingPage() {
  const [roomIdInput, setRoomIdInput] = useState("");
  const router = useRouter();

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    router.push(`/chat/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/chat/${roomIdInput.trim()} `);
  };

  return (
    <div className="relative h-screen w-full bg-zinc-50 dark:bg-linear-to-br dark:from-black dark:via-zinc-950 dark:to-black overflow-hidden flex flex-col">
      <div
        className="absolute inset-0 bg-linear-to-br from-white via-zinc-50 to-white dark:bg-linear-to-br dark:from-black dark:via-zinc-950 dark:to-black pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #27272a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <NavBar />

      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
        >
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 text-white mx-auto mb-3 sm:mb-4">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Secure Chat Rooms
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 sm:mt-2 leading-relaxed px-1">
              Create a new ephemeral room, or enter a room link or identifier to
              connect with a peer securely.
            </p>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleCreateRoom}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black h-11 sm:h-12 rounded-xl font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Room</span>
              </button>
              <div className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3 shrink-0" />
                <span>Generates a unique encrypted session link</span>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-zinc-200 dark:border-zinc-800/80"></div>
              <span className="shrink mx-4 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                or
              </span>
              <div className="grow border-t border-zinc-200 dark:border-zinc-800/80"></div>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-2 sm:space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Join Existing Room
                </label>
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-850 rounded-xl p-1 shadow-xs focus-within:border-zinc-350 dark:focus-within:border-zinc-750 transition-colors">
                  <input
                    type="text"
                    required
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    placeholder="Enter Room ID"
                    className="flex-1 text-xs px-2 bg-transparent text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!roomIdInput.trim()}
                    className="h-9 w-9 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.92]"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
