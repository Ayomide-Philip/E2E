/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Copy, Check, Send, Shield } from "lucide-react";
import { toast } from "sonner";
import ChatNavBar from "./navbar";

export function ChatRoom({ roomId }: { roomId: string }) {
  const [roomLink, setRoomLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPartnerJoined, setIsPartnerJoined] = useState(false);
  const [createdTime, setCreatedTime] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3000/api/ws`);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket.send(JSON.stringify({ type: "join", roomId }));
    };

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data.toString());
      console.log("Received message:", data);
      if (data?.type === "peer-joined") {
        toast.success(
          "A peer has joined the room! You can start chatting securely.",
        );
        setTotalUser(data?.count || 0);
        if (data?.count === 2) {
          setIsPartnerJoined(true);
        }
      }

      if (data?.type === "peer-left") {
        toast.success("Your chat partner has left the room.", {
          description: "Waiting for another peer to join...",
        });
        setIsPartnerJoined(false);
        setTotalUser(data?.count || 0);
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRoomLink(`${window.location.origin}/chat/${roomId}`);
    }
  }, [roomId]);

  useEffect(() => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCreatedTime(`Today at ${time}`);
  }, []);

  useEffect(() => {
    if (isPartnerJoined) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isPartnerJoined]);

  const sampleMessages = [
    {
      id: 1,
      text: "Hey! Just joined the room. Is this connection secure?",
      sender: "partner",
      time: "1:42 PM",
    },
    {
      id: 2,
      text: "Yes, it's end-to-end encrypted using Web Cryptography API. Keys are generated locally and never leave our devices.",
      sender: "me",
      time: "1:42 PM",
    },
    {
      id: 3,
      text: "That's awesome. Where are the messages stored?",
      sender: "partner",
      time: "1:43 PM",
    },
    {
      id: 4,
      text: "Nowhere! Everything is routed through memory via WebSockets and deleted automatically as soon as the session ends.",
      sender: "me",
      time: "1:43 PM",
    },
    {
      id: 5,
      text: "Perfect, no logs left behind! Let's start chatting here.",
      sender: "partner",
      time: "1:44 PM",
    },
  ];

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

      <ChatNavBar
        roomId={roomId}
        isPartnerJoined={isPartnerJoined}
        handleCopy={handleCopy}
        copied={copied}
      />

      <main className="relative z-10 flex-1 flex overflow-hidden w-full max-w-6xl mx-auto p-4 md:p-6 min-h-0">
        <div className="flex-1 flex flex-col min-w-0 bg-white/70 dark:bg-zinc-950/20 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none overflow-hidden">
          <AnimatePresence mode="wait">
            {!isPartnerJoined ? (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center"
              >
                <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.15, 0.4, 0.15],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.5,
                      ease: "easeInOut",
                    }}
                    className="absolute w-36 h-36 rounded-full border border-blue-500/30 dark:border-blue-400/25"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.5,
                      ease: "easeInOut",
                      delay: 0.6,
                    }}
                    className="absolute w-28 h-28 rounded-full border border-purple-500/35 dark:border-purple-400/25"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.5,
                      ease: "easeInOut",
                      delay: 1.2,
                    }}
                    className="absolute w-20 h-20 rounded-full border border-zinc-200 dark:border-zinc-800"
                  />
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4.5,
                      ease: "easeInOut",
                    }}
                    className="absolute w-14 h-14 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25 text-white z-10"
                  >
                    <Lock className="h-6 w-6" />
                  </motion.div>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                  Waiting for someone to join...
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
                  Share this link with a friend to start chatting. The session
                  remains temporary and encrypted.
                </p>

                <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 w-full max-w-md text-left shadow-xs">
                  <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-wider">
                    Shareable Room Link
                  </span>
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-1.5 shadow-xs">
                    <input
                      type="text"
                      readOnly
                      value={roomLink}
                      className="flex-1 text-xs font-mono text-zinc-600 dark:text-zinc-350 px-2 select-all outline-none truncate"
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        copied
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 dark:bg-emerald-400/5 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl text-xs max-w-md text-center shadow-xs">
                      <Shield className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        This room is fully encrypted end-to-end. No database or
                        server logs are kept.
                      </span>
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
                    {sampleMessages.map((msg) => {
                      const isMe = msg.sender === "me";
                      return (
                        <motion.div
                          key={msg.id}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            show: { opacity: 1, y: 0 },
                          }}
                          className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                            isMe
                              ? "self-end items-end"
                              : "self-start items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? "bg-zinc-900 dark:bg-white text-white dark:text-black rounded-tr-xs shadow-xs"
                                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/50 dark:border-zinc-800/85 rounded-tl-xs shadow-xs"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 px-1.5 font-medium">
                            {msg.time}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 md:p-6 bg-linear-to-t from-white/95 via-white/50 to-transparent dark:from-zinc-950/95 dark:via-zinc-950/50 dark:to-transparent shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/60">
                  <div className="flex items-center gap-2 max-w-4xl mx-auto bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none p-1.5">
                    <input
                      type="text"
                      placeholder="Secure connection active. Send encrypted message..."
                      disabled
                      className="flex-1 px-4 py-2.5 text-sm bg-transparent border-0 outline-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 cursor-not-allowed"
                    />
                    <button
                      disabled
                      className="bg-zinc-900 dark:bg-white text-white dark:text-black h-10 px-5 rounded-xl font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors cursor-not-allowed opacity-50 flex items-center gap-1.5"
                    >
                      <Send className="h-4 w-4" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="hidden md:flex flex-col w-72 shrink-0 pl-6 h-full min-h-0">
          <div className="bg-white/70 dark:bg-zinc-950/20 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Room Parameters
              </h3>

              <div className="space-y-3.5">
                <div>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                    Room Identifier
                  </span>
                  <span
                    className="text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 select-all truncate block mt-0.5"
                    title={roomId}
                  >
                    {roomId}
                  </span>
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800/40" />

                <div>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                    Encryption Mode
                  </span>
                  <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 block mt-0.5">
                    AES-GCM 256-bit
                  </span>
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800/40" />

                <div>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                    Participants
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-200">
                      {isPartnerJoined
                        ? `${totalUser} / 2 Connected`
                        : `${totalUser}/2 Connected`}
                    </span>
                    <span className="flex h-2 w-2 relative">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPartnerJoined ? "bg-emerald-400" : "bg-amber-400"}`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${isPartnerJoined ? "bg-emerald-500" : "bg-amber-500"}`}
                      />
                    </span>
                  </div>
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800/40" />

                <div>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                    Room Established
                  </span>
                  <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 block mt-0.5">
                    {createdTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 dark:bg-emerald-400/5 border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl p-3 flex items-start gap-2.5 my-3 shrink-0">
              <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h4 className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                  End-to-End Encrypted
                </h4>
                <p className="text-[9px] text-emerald-600 dark:text-emerald-550 mt-0.5 leading-normal">
                  AES-GCM 255-bit keys derived locally; ciphertext only routed.
                </p>
              </div>
            </div>

            <div className="bg-zinc-100/50 dark:bg-zinc-900/10 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-3 shrink-0">
              <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                Session Expiration
              </span>
              <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-0.5 leading-normal">
                This chat is completely ephemeral. Closing tabs purges memory
                allocations instantly.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
