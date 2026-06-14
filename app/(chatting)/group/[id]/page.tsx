"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Lock } from "lucide-react";
import Toggle from "@/components/Toggle";
import WaitingScreen from "@/components/group/chat/waitingState";
import MessageActive from "@/components/group/chat/messageActive";

type Message = {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  timestamp: Date;
  type?: "text" | "image" | "link";
  linkUrl?: string;
};

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "system",
    text: "You joined this private room",
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: "2",
    sender: "other",
    text: "Hey! Glad you made it. This room is completely private and secure.",
    timestamp: new Date(Date.now() - 540000),
  },
  {
    id: "3",
    sender: "me",
    text: "Awesome, thanks for setting this up! 🔥",
    timestamp: new Date(Date.now() - 480000),
  },
  {
    id: "4",
    sender: "other",
    text: "Of course! I wanted to share the project files with you. The new design system is looking incredible. I've been working on the component library and I think you'll really like what we've put together so far.",
    timestamp: new Date(Date.now() - 420000),
  },
  {
    id: "5",
    sender: "other",
    text: "Check out this screenshot of the new dashboard",
    timestamp: new Date(Date.now() - 360000),
    type: "image",
  },
  {
    id: "6",
    sender: "me",
    text: "That looks dope! The gradient work is clean. Here's the figma link:",
    timestamp: new Date(Date.now() - 300000),
    type: "link",
    linkUrl: "https://figma.com/file/demo",
  },
  {
    id: "7",
    sender: "other",
    text: "Perfect, I'll check it out. Also, we should discuss the API integration for the real-time features.",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "8",
    sender: "me",
    text: "Sounds good. Let me know when you're free tomorrow!",
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: "9",
    sender: "other",
    text: "Will do. Talk to you later! 👋",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "10",
    sender: "system",
    text: "Messages are end-to-end encrypted",
    timestamp: new Date(Date.now() - 60000),
  },
];

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulate partner typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPartnerTyping(true);
      setTimeout(() => setIsPartnerTyping(false), 3000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  function handleSend() {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "me",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && input.trim()) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/group/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isPartnerJoined = true;

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

      <div className="relative z-20 w-full px-3 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-3 shrink-0">
        <nav className="mx-auto flex w-full items-center justify-between gap-2 sm:gap-4 rounded-2xl sm:rounded-full px-3 sm:px-5 py-2.5 sm:py-3 bg-white/80 dark:bg-zinc-950/60 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white shrink-0"
              title="Leave Room"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>

            <div className="flex items-center gap-1.5 min-w-0">
              <Lock className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
              <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                Group
              </span>
              <span className="hidden sm:inline-flex bg-linear-to-br from-blue-500 to-purple-600 text-[9px] text-white px-1.5 py-0.5 rounded-full font-bold">
                E2E
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 min-w-0 flex-1 justify-center">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 text-[10px] font-mono rounded-full border border-zinc-200 dark:border-zinc-800 min-w-0 max-w-45 md:max-w-60">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:text-zinc-600 shrink-0" />
              <span className="truncate" title={id}>
                {id}
              </span>
            </div>

            <motion.div
              key={isPartnerJoined ? "connected" : "waiting"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all shrink-0 ${
                isPartnerJoined
                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800/40"
                  : "bg-amber-500/10 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800/40"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${
                  isPartnerJoined ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span>{isPartnerJoined ? "Connected" : "Waiting..."}</span>
            </motion.div>
          </div>

          <div className="sm:hidden flex items-center">
            <span
              className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${
                isPartnerJoined ? "bg-emerald-500" : "bg-amber-500"
              }`}
              title={isPartnerJoined ? "Connected" : "Waiting for peer..."}
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
              title="Copy Room Link"
            >
              {copied ? (
                <Check className="h-3 w-3 shrink-0" />
              ) : (
                <Copy className="h-3 w-3 shrink-0" />
              )}
              <span className="hidden md:inline">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>

            <div className="p-1.5 sm:p-2 rounded-full border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center">
              <Toggle />
            </div>
          </div>
        </nav>
      </div>

      <main className="relative z-10 flex-1 flex flex-col min-h-0">
        {!isPartnerJoined ? (
          <WaitingScreen roomId={id} />
        ) : (
          <MessageActive
            messages={messages}
            isPartnerTyping={isPartnerTyping}
            input={input}
            setInput={setInput}
            handleKeyDown={handleKeyDown}
            handleSend={handleSend}
          />
        )}
      </main>
    </div>
  );
}
