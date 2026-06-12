"use client";

import Toggle from "@/components/Toggle";
import { useRouter } from "next/navigation";
export default function NavBar() {
  const router = useRouter();
  return (
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

      <button
        onClick={() => router.push("/chat")}
        className="bg-zinc-900 dark:bg-white/95 text-white dark:text-black px-5 py-2.5 rounded-full font-medium text-sm hover:bg-zinc-700 dark:hover:bg-white transition-colors shadow-sm shadow-black/20"
      >
        Start Chat
      </button>
    </nav>
  );
}
