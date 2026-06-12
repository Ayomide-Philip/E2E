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
