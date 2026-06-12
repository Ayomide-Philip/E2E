/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import ChatNavBar from "./navbar";
import WaitingChatRoom from "./waitingChatRoom";
import ChatRoomActive from "./chatRoomActive";

export function ChatRoom({ roomId }: { roomId: string }) {
  const [roomLink, setRoomLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPartnerJoined, setIsPartnerJoined] = useState(false);
  const [createdTime, setCreatedTime] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: "me" | "partner"; time: string }>
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  function handleSendMessage() {
    if (!inputMessage.trim() || !isPartnerJoined) return;

    socketRef.current?.send(
      JSON.stringify({
        data: inputMessage.trim(),
        type: "message",
      }),
    );

    setMessages((prev) => [
      ...prev,
      {
        text: inputMessage.trim(),
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInputMessage("");
  }

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:3000/api/ws`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      socketRef.current?.send(JSON.stringify({ type: "join", roomId }));
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
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

      if (data?.type === "message") {
        setMessages((prev) => [
          ...prev,
          {
            text: data?.data,
            sender: "partner",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
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

  // const sampleMessages = [
  //   {
  //     id: 1,
  //     text: "Hey! Just joined the room. Is this connection secure?",
  //     sender: "partner",
  //     time: "1:42 PM",
  //   },
  //   {
  //     id: 2,
  //     text: "Yes, it's end-to-end encrypted using Web Cryptography API. Keys are generated locally and never leave our devices.",
  //     sender: "me",
  //     time: "1:42 PM",
  //   },
  //   {
  //     id: 3,
  //     text: "That's awesome. Where are the messages stored?",
  //     sender: "partner",
  //     time: "1:43 PM",
  //   },
  //   {
  //     id: 4,
  //     text: "Nowhere! Everything is routed through memory via WebSockets and deleted automatically as soon as the session ends.",
  //     sender: "me",
  //     time: "1:43 PM",
  //   },
  //   {
  //     id: 5,
  //     text: "Perfect, no logs left behind! Let's start chatting here.",
  //     sender: "partner",
  //     time: "1:44 PM",
  //   },
  // ];

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
              <WaitingChatRoom
                roomLink={roomLink}
                handleCopy={handleCopy}
                copied={copied}
              />
            ) : (
              <ChatRoomActive
                messages={messages}
                isPartnerJoined={isPartnerJoined}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                messagesEndRef={messagesEndRef}
              />
            )}
          </AnimatePresence>
        </div>

        <aside className="hidden md:flex flex-col w-68 shrink-0 pl-4 h-full min-h-0">
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            <div className="bg-white/80 dark:bg-zinc-950/40 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shrink-0">
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
                Session Info
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-zinc-500 dark:text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                      Room ID
                    </p>
                    <p
                      className="text-[10px] font-mono font-bold text-zinc-800 dark:text-zinc-200 truncate mt-0.5 select-all"
                      title={roomId}
                    >
                      {roomId}
                    </p>
                  </div>
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800/50" />

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                      Encryption
                    </p>
                    <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      AES-GCM 256-bit
                    </p>
                  </div>
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800/50" />

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-zinc-500 dark:text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                      Participants
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                        {isPartnerJoined
                          ? `${totalUser} / 2`
                          : `${totalUser} / 2`}
                      </p>
                      <span className="relative flex h-1.5 w-1.5">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPartnerJoined ? "bg-emerald-400" : "bg-amber-400"}`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isPartnerJoined ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                      </span>
                      <span
                        className={`text-[9px] font-semibold ${isPartnerJoined ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
                      >
                        {isPartnerJoined ? "Full" : "Waiting"}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800/50" />

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-zinc-500 dark:text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                      Established
                    </p>
                    <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      {createdTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/8 dark:to-teal-500/3 border border-emerald-500/20 dark:border-emerald-500/15 rounded-2xl p-4 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 dark:bg-emerald-400/15 flex items-center justify-center">
                  <Lock className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400">
                  End-to-End Encrypted
                </p>
              </div>
              <p className="text-[9px] text-emerald-700/80 dark:text-emerald-500 leading-relaxed">
                Keys are derived locally in your browser. The server only relays
                ciphertext — plaintext is never exposed.
              </p>
            </div>

            <div className="mt-auto bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200/60 dark:border-zinc-800/40 rounded-2xl p-3.5 shrink-0">
              <div className="flex items-center gap-1.5 mb-1">
                <svg
                  className="w-3 h-3 text-zinc-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Ephemeral Session
                </p>
              </div>
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
                No logs, no database. All data is purged the moment both
                participants leave.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
