"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Lock,
  ImageIcon,
  Send,
  Link2,
} from "lucide-react";
import Toggle from "@/components/Toggle";
import WaitingScreen from "@/components/group/chat/waitingState";
import TypingDots from "@/components/typingDot";

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

// ─── Message Bubble ───────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isMe = message.sender === "me";
  const isSystem = message.sender === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center py-1.5"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-zinc-100/70 dark:bg-zinc-800/50 px-3 py-1.5 backdrop-blur-sm">
          <Shield className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
            {message.text}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
      className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
        isMe ? "self-end items-end" : "self-start items-start"
      }`}
    >
      <div
        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-full ${
          isMe
            ? "bg-zinc-900 dark:bg-white text-white dark:text-black rounded-tr-xs shadow-xs"
            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/50 dark:border-zinc-800/85 rounded-tl-xs shadow-xs"
        }`}
      >
        {message.type === "image" ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-center h-28 sm:h-32 w-full rounded-xl bg-linear-to-br from-purple-400 via-pink-400 to-orange-300 dark:from-purple-600 dark:via-pink-600 dark:to-orange-500">
              <ImageIcon className="h-6 sm:h-8 w-6 sm:w-8 text-white/70" />
            </div>
            <p className="whitespace-pre-wrap wrap-break-word">
              {message.text}
            </p>
          </div>
        ) : message.type === "link" ? (
          <div className="space-y-1.5">
            <p className="whitespace-pre-wrap wrap-break-word">
              {message.text}
            </p>
            <a
              href={message.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 rounded-xl p-2 text-[10px] sm:text-xs ${
                isMe
                  ? "bg-white/15 text-white hover:bg-white/20"
                  : "bg-zinc-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              } transition-colors duration-200`}
            >
              <Link2 className="h-3 sm:h-3.5 w-3 sm:w-3.5 shrink-0" />
              <span className="truncate">{message.linkUrl}</span>
            </a>
          </div>
        ) : (
          <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
        )}
        <div
          className={`flex items-center justify-end gap-1 mt-0.5 ${
            isMe ? "text-white/50" : "text-zinc-400 dark:text-zinc-500"
          }`}
        >
          <span className="text-[10px]">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isMe && <Check className="h-3 w-3" />}
        </div>
      </div>
    </motion.div>
  );
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Simulate partner typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPartnerTyping(true);
      setTimeout(() => setIsPartnerTyping(false), 3000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [input]);

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
      {/* Background dot pattern */}
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

      {/* ─── Navbar (matching chat/[id] style) ──────── */}
      <div className="relative z-20 w-full px-3 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-3 shrink-0">
        <nav className="mx-auto flex w-full items-center justify-between gap-2 sm:gap-4 rounded-2xl sm:rounded-full px-3 sm:px-5 py-2.5 sm:py-3 bg-white/80 dark:bg-zinc-950/60 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          {/* Left */}
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

          {/* Center: Room ID + Status (hidden on mobile) */}
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

          {/* Mobile status dot */}
          <div className="sm:hidden flex items-center">
            <span
              className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${
                isPartnerJoined ? "bg-emerald-500" : "bg-amber-500"
              }`}
              title={isPartnerJoined ? "Connected" : "Waiting for peer..."}
            />
          </div>

          {/* Right */}
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

      {/* ─── Security Banner ───────────────────────── */}

      {/* ─── Chat Area / Waiting State ─────────────── */}
      <main className="relative z-10 flex-1 flex flex-col min-h-0">
        {!isPartnerJoined ? (
          <WaitingScreen roomId={id} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
              {/* Security badge */}
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 dark:bg-emerald-400/5 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl text-[10px] sm:text-xs max-w-[90%] sm:max-w-md text-center shadow-xs">
                  <Shield className="h-3 sm:h-3.5 w-3 sm:w-3.5 shrink-0" />
                  <span>End-to-end encrypted chat</span>
                </div>
              </div>

              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12 },
                  },
                }}
                className="flex flex-col gap-4"
              >
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </motion.div>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isPartnerTyping && <TypingDots />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ─── Message Composer ────────────────────── */}
            <div className="p-2 sm:p-3 md:p-4 bg-linear-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 dark:to-transparent shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/60">
              <div className="flex items-center gap-1.5 sm:gap-2 max-w-4xl mx-auto bg-white dark:bg-zinc-900 backdrop-blur-md rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none p-1 sm:p-1.5">
                <textarea
                  ref={textareaRef}
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className="flex-1 px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-transparent border-0 outline-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none min-h-9 sm:min-h-10 max-h-40 leading-relaxed"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                    input.trim()
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-100 cursor-pointer shadow-sm active:scale-[0.96]"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Send className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
