"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import WaitingScreen from "@/components/group/chat/waitingState";
import MessageActive from "@/components/group/chat/messageActive";
import GroupNavBar from "@/components/group/chat/navbar";

export type Message = {
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
    </div>
  );
}
