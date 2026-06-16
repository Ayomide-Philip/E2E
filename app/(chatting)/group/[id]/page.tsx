"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Lock } from "lucide-react";
import WaitingScreen from "@/components/group/chat/waitingState";
import MessageActive from "@/components/group/chat/messageActive";
import GroupNavBar from "@/components/group/chat/navbar";
import PasswordModal from "@/components/group/chat/passwordModal";
import { toast } from "sonner";
export type Message = {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  timestamp: Date;
  type?: "text" | "image" | "link";
  linkUrl?: string;
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(true);
  const [groupPassword, setGroupPassword] = useState<string | null>(null);
  const [startGroupChat, setStartGroupChat] = useState<boolean>(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  function handlePasswordSubmit(password: string) {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "join-room",
          roomId: id,
          roomPassword: password,
        }),
      );
    } else {
      console.log(
        "Socket not ready yet, state:",
        socketRef.current?.readyState,
      );
      return toast.error("Connecting to server. Please try again.");
    }
  }

  useEffect(() => {
    if (!window) return;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    socketRef.current = new WebSocket(`${protocol}://${host}/api/ws`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message?.type === "joined-room") {
        setStartGroupChat(true);
        setPasswordModalOpen(false);
        toast.success("Joined room successfully!");
        if (message.count > 1) {
          setStartGroupChat(true);
        }
      }

      if(message?.type === "peer-joined"){
        toast.success("A new member joined the group chat")
      }

      if (message?.type === "require-password") {
        setPasswordError("Incorrect password. Please try again.");
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

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
      <GroupNavBar id={id} isPartnerJoined={isPartnerJoined} />
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
      <PasswordModal
        open={passwordModalOpen}
        roomId={id}
        onPasswordSubmit={handlePasswordSubmit}
        onClose={() => setPasswordModalOpen(false)}
        error={passwordError}
        isLoading={false}
        groupPassword={groupPassword}
        setGroupPassword={setGroupPassword}
      />
      {groupPassword && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setShowPasswordInfo((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 dark:bg-white/10 backdrop-blur-xl border border-zinc-700/50 dark:border-zinc-600/30 text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-300 dark:hover:text-zinc-300 transition-all"
          >
            <Lock className="h-3 w-3" />
            <span>Room secured</span>
            {showPasswordInfo && (
              <span className="font-mono text-violet-400 dark:text-violet-300">
                {groupPassword}
              </span>
            )}
          </button>
        </div>
      )}{" "}
    </div>
  );
}
