"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  MoreVertical,
  Check,
  Shield,
  Lock,
  Timer,
  Eye,
  ImageIcon,
  Paperclip,
  Send,
  Smile,
  UserPlus,
  Link2,
  Clock,
  Wifi,
  WifiOff,
  Loader2,
  Hash,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
type Message = {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  timestamp: Date;
  type?: "text" | "image" | "link";
  imageUrl?: string;
  linkUrl?: string;
};

type ConnectionStatus = "connected" | "waiting" | "disconnected";

// ─── Mock Data ────────────────────────────────────────────────────────
const ROOM_NAME = "Private Chat";
const ROOM_ID = "8xK3mZ9p";

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
    imageUrl: "",
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

// ─── Typing Dots Component ────────────────────────────────────────────
function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-3 px-5 py-3"
    >
      <div className="flex items-center gap-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/70 px-4 py-3">
        <motion.span
          className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
        Partner is typing...
      </span>
    </motion.div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isMe = message.sender === "me";
  const isSystem = message.sender === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center py-2"
      >
        <div className="flex items-center gap-2 rounded-full bg-zinc-100/70 dark:bg-zinc-800/50 px-4 py-1.5 backdrop-blur-sm">
          <Shield className="h-3 w-3 text-emerald-500" />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {message.text}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} px-4`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isMe
            ? "bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
            : "bg-white/70 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-xl"
        } rounded-2xl px-4 py-2.5 ${isMe ? "rounded-br-md" : "rounded-bl-md"}`}
      >
        {message.type === "image" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center h-32 w-full rounded-xl bg-linear-to-br from-purple-400 via-pink-400 to-orange-300 dark:from-purple-600 dark:via-pink-600 dark:to-orange-500">
              <ImageIcon className="h-8 w-8 text-white/70" />
            </div>
            <p className="text-sm">{message.text}</p>
          </div>
        ) : message.type === "link" ? (
          <div className="space-y-1.5">
            <p className="text-sm">{message.text}</p>
            <a
              href={message.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 rounded-xl p-2.5 text-xs ${
                isMe
                  ? "bg-white/15 text-white hover:bg-white/20"
                  : "bg-zinc-100 dark:bg-zinc-700/50 text-blue-600 dark:text-blue-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              } transition-colors duration-200`}
            >
              <Link2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{message.linkUrl}</span>
            </a>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        )}
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            isMe ? "text-white/60" : "text-zinc-400 dark:text-zinc-500"
          }`}
        >
          <span className="text-[10px]">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isMe && (
            <span className="flex">
              <Check className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Waiting Screen ───────────────────────────────────────────────────
function WaitingScreen({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(`${window.location.origin}/group/${roomId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    const url = `${window.location.origin}/group/${roomId}`;
    if (navigator.share) {
      navigator.share({ title: "Join my private room", url });
    } else {
      handleCopy();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center flex-1 px-6 py-12"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mb-8"
      >
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/5 dark:via-purple-400/5 dark:pink-400/5 border border-zinc-200/50 dark:border-zinc-700/50">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-400/10 dark:via-purple-400/10 dark:pink-400/10">
            <UserPlus className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        {/* Animated rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400/30 dark:border-blue-500/20"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-purple-400/20 dark:border-purple-500/10"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-zinc-900 dark:text-white mb-2"
      >
        Waiting for someone to join...
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs mb-8"
      >
        Share the room link or ID with your partner to start a private
        conversation.
      </motion.p>

      {/* Room ID Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg">
            <Hash className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Room ID</p>
            <p className="text-sm font-mono font-semibold text-zinc-900 dark:text-white">
              {roomId}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Room Link
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white py-2.5 text-xs font-semibold text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-300"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Share Room
          </motion.button>
        </div>
      </motion.div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-2"
      >
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          Waiting for participant...
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Security Banner ──────────────────────────────────────────────────
function SecurityBanner() {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      className="overflow-hidden border-b border-zinc-200/50 dark:border-zinc-800/50"
    >
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-linear-to-r from-emerald-500/5 via-emerald-500/10 to-emerald-500/5 dark:from-emerald-400/5 dark:via-emerald-400/10 dark:to-emerald-400/5 border border-emerald-200/50 dark:border-emerald-800/50 px-4 py-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              End-to-End Encrypted
            </span>
          </div>
          <div className="hidden sm:block h-3 w-px bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex items-center gap-2">
            <Timer className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Temporary Room
            </span>
          </div>
          <div className="hidden sm:block h-3 w-px bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Private Conversation
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("connected");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Auto-grow textarea
  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }

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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/group/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast("Room link copied!");
  }

  // Simple toast
  function toast(msg: string) {
    const el = document.createElement("div");
    el.className =
      "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-zinc-900 dark:bg-white px-4 py-2 text-sm text-white dark:text-black shadow-2xl animate-fade-in";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }

  const statusConfig = {
    connected: {
      label: "Connected",
      icon: Wifi,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      dot: "bg-emerald-500",
    },
    waiting: {
      label: "Waiting for partner",
      icon: Loader2,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      dot: "bg-amber-500",
    },
    disconnected: {
      label: "Disconnected",
      icon: WifiOff,
      color: "text-red-500",
      bg: "bg-red-500/10",
      dot: "bg-red-500",
    },
  };

  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  const waitingState = status === "waiting" || messages.length < 3;

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-black">
      {/* ─── Sticky Header ─────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left: Back + Info */}
          <div className="flex items-center gap-3 min-w-0">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {ROOM_NAME}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 truncate">
                  ID: {id}
                </span>
                <span className="text-[10px] text-zinc-300 dark:text-zinc-600">
                  ·
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot} animate-pulse`}
                  />
                  <span
                    className={`text-[11px] font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <motion.button
              onClick={handleCopyLink}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
              title="Copy Link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </motion.button>

            {/* More Menu */}
            <div ref={menuRef} className="relative">
              <motion.button
                onClick={() => setShowMenu(!showMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
              >
                <MoreVertical className="h-4 w-4" />
              </motion.button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-xl overflow-hidden"
                  >
                    {[
                      { label: "Clear Chat", icon: Clock },
                      { label: "Report Room", icon: Eye },
                      { label: "Leave Room", icon: ArrowLeft },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setShowMenu(false)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                      >
                        <item.icon className="h-4 w-4 text-zinc-400" />
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Security Banner ───────────────────────── */}
      <SecurityBanner />

      {/* ─── Chat Area / Waiting State ─────────────── */}
      <main className="flex-1 overflow-y-auto">
        {waitingState ? (
          <WaitingScreen roomId={id} />
        ) : (
          <div className="py-4 space-y-1">
            {/* Date separator */}
            <div className="flex justify-center py-3">
              <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100/70 dark:bg-zinc-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
                Today
              </span>
            </div>

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            <AnimatePresence>
              {isPartnerTyping && <TypingDots />}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* ─── Message Composer ──────────────────────── */}
      {!waitingState && (
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="sticky bottom-0 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-4 py-3"
        >
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex items-center gap-1">
              <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200">
                <Smile className="h-5 w-5" />
              </button>
              <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200">
                <Paperclip className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full resize-none rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 px-4 py-2.5 pr-12 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:focus:border-blue-600 transition-all duration-300 max-h-[120px]"
              />
            </div>

            <motion.button
              onClick={handleSend}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
