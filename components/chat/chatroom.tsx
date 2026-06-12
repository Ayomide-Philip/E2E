/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ChatNavBar from "./navbar";
import WaitingChatRoom from "./waitingChatRoom";
import ChatRoomActive from "./chatRoomActive";
import ChatRoomInformation from "./chatRoomInformation";
import {
  encryptMessage,
  generateKeysValuePairs,
  getEncryptionKey,
} from "@/lib/crypto";

export function ChatRoom({ roomId }: { roomId: string }) {
  const [roomLink, setRoomLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPartnerJoined, setIsPartnerJoined] = useState(false);
  const [createdTime, setCreatedTime] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  const [partnerPublicKey, setPartnerPublicKey] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [keys, setKeys] = useState<{
    privateKey: CryptoKey;
    publicKey: string;
  } | null>(null);
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

  async function handleSendMessage() {
    if (!inputMessage.trim() || !isPartnerJoined) return;
    if (!encryptionKey)
      return toast.error(
        "Encryption key is not ready yet. Please wait a moment.",
      );
    socketRef.current?.send(
      JSON.stringify({
        type: "message",
        ...(await encryptMessage(encryptionKey!, inputMessage.trim())),
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
    async function deriveEncryptionKey() {
      if (keys && partnerPublicKey) {
        const sharedKey = await getEncryptionKey(
          keys.privateKey,
          partnerPublicKey,
        );
        setEncryptionKey(sharedKey);
      }
    }
    deriveEncryptionKey();
  }, [keys, partnerPublicKey]);

  useEffect(() => {
    if (!keys) return;
    socketRef.current = new WebSocket(`ws://localhost:3000/api/ws`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      socketRef.current?.send(
        JSON.stringify({ type: "join", roomId, publicKey: keys?.publicKey }),
      );
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
            text: data?.ciphertext || "",
            sender: "partner",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }

      if (data?.type === "peer-public-key") {
        setPartnerPublicKey(data?.publicKey);
      }
    };
  }, [roomId, keys]);

  useEffect(() => {
    async function generateKeyValue() {
      const keys = await generateKeysValuePairs();
      setKeys(keys);
    }
    generateKeyValue();

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCreatedTime(`Today at ${time}`);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRoomLink(`${window.location.origin}/chat/${roomId}`);
    }
  }, [roomId]);

  useEffect(() => {
    if (isPartnerJoined) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isPartnerJoined]);

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

        <ChatRoomInformation
          roomId={roomId}
          isPartnerJoined={isPartnerJoined}
          totalUser={totalUser}
          createdTime={createdTime}
        />
      </main>
    </div>
  );
}
