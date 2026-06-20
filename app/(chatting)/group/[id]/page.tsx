"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import WaitingScreen from "@/components/group/chat/waitingState";
import MessageActive from "@/components/group/chat/messageActive";
import GroupNavBar from "@/components/group/chat/navbar";
import PasswordModal from "@/components/group/chat/passwordModal";
import { toast } from "sonner";

export type Message = {
  text: string;
  sender: "me" | "other" | "system";
  timestamp?: string;
  name?: string;
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [userName, setUserName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(true);
  const [groupPassword, setGroupPassword] = useState<string | null>(null);
  const [startGroupChat, setStartGroupChat] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const partnerTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const lastTypingSentRef = useRef(0);

  useEffect(() => {
    if (!input) return;

    const now = Date.now();

    if (now - lastTypingSentRef.current > 500) {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: "typing", isTyping: true }),
        );
        lastTypingSentRef.current = now;
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: "typing", isTyping: false }),
        );
      }
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [input, id]);

  function handleSend() {
    if (!input.trim()) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "typing", isTyping: false }),
      );
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const newMsg: Message = {
      text: input.trim(),
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      name: userName || "Anonymous",
    };
    socketRef.current?.send(
      JSON.stringify({
        type: "message",
        text: input.trim(),
        timestamp: newMsg.timestamp,
        name: userName || "Anonymous",
      }),
    );

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
          userName: userName || "Anonymous",
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
      console.log(message);

      if (message?.type === "joined-room") {
        setPasswordModalOpen(false);
        toast.success("Joined room successfully!");
        if (message.count > 1) {
          setStartGroupChat(true);
        }
      }

      if (message?.type === "peer-joined") {
        if (message?.count > 1) {
          setStartGroupChat(true);
        }
        setMessages((prev) => {
          const systemMsg: Message = {
            text: "A new participant has joined the chat.",
            sender: "system",
          };
          return [...prev, systemMsg];
        });
      }

      if (message?.type === "require-password") {
        setPasswordError("Incorrect password. Please try again.");
      }

      if (message?.type === "required-username") {
        setPasswordError(
          message?.message || "Username is required. Please enter a username.",
        );
      }

      if (message?.type === "username-error") {
        setPasswordError(message?.message || "Username is not available");
      }

      if (message?.type === "typing") {
        if (message.isTyping === false) {
          setIsPartnerTyping(false);
          if (partnerTypingTimeoutRef.current) {
            clearTimeout(partnerTypingTimeoutRef.current);
          }
        } else {
          setIsPartnerTyping(true);
          if (partnerTypingTimeoutRef.current) {
            clearTimeout(partnerTypingTimeoutRef.current);
          }
          partnerTypingTimeoutRef.current = setTimeout(() => {
            setIsPartnerTyping(false);
          }, 3000);
        }
      }

      if (message?.type === "message") {
        const newMsg: Message = {
          text: message.text,
          sender: "other",
          timestamp: message.timestamp,
          name: message.name,
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    return () => {
      socketRef.current?.close();
      if (partnerTypingTimeoutRef.current) {
        clearTimeout(partnerTypingTimeoutRef.current);
      }
    };
  }, []);

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
      <GroupNavBar id={id} isPartnerJoined={startGroupChat} />
      <main className="relative z-10 flex-1 flex flex-col min-h-0">
        {!startGroupChat ? (
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
        userName={userName}
        setUserName={setUserName}
      />
    </div>
  );
}
