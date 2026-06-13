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
  decryptMessage,
} from "@/lib/crypto";

export function ChatRoom({ roomId }: { roomId: string }) {
  const [roomLink, setRoomLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPartnerJoined, setIsPartnerJoined] = useState(false);
  const [createdTime, setCreatedTime] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  const [partnerPublicKey, setPartnerPublicKey] = useState<string | null>(null);
  const encryptionKeyRef = useRef<CryptoKey | null>(null);
  const [keys, setKeys] = useState<{
    privateKey: CryptoKey;
    publicKey: string;
  } | null>(null);
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: "me" | "partner"; time: string }>
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [callState, setCallState] = useState<
    "idle" | "calling" | "incoming" | "active"
  >("idle");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  async function startCall() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Your browser does not support WebRTC.");
      return;
    }
    setCallState("calling");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.ontrack = (event) => {
        const audioEl = document.getElementById(
          "remoteAudio",
        ) as HTMLAudioElement;
        if (audioEl) {
          audioEl.srcObject = event.streams[0];
          audioEl.play().catch((e) => console.log("Autoplay prevented:", e));
        }
      };
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.send(
            JSON.stringify({
              type: "webrtc-ice",
              candidate: event.candidate,
            }),
          );
        }
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log("ICE state:", peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === "connected") {
          console.log("✅ ICE connected - audio should flow");
        }
        if (
          peerConnection.iceConnectionState === "disconnected" ||
          peerConnection.iceConnectionState === "failed" ||
          peerConnection.iceConnectionState === "closed"
        ) {
          hangCall();
          toast.info("Call disconnected");
        }
      };
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socketRef.current?.send(
        JSON.stringify({
          type: "webrtc-offer",
          sdp: offer,
        }),
      );
      localStreamRef.current = stream;
      peerConnectionRef.current = peerConnection;
    } catch (err) {
      console.log("Failed to start call", err);
      toast.error("Failed to start call. Please try again.");
    }
  }

  async function hangCall() {
    socketRef.current?.send(JSON.stringify({ type: "call-ended" }));

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    const audioEl = document.getElementById("remoteAudio") as HTMLAudioElement;
    if (audioEl) audioEl.srcObject = null;
    setCallState("idle");
  }

  async function handleSendMessage() {
    if (!inputMessage.trim() || !isPartnerJoined) return;
    if (!encryptionKeyRef.current)
      return toast.error(
        "Encryption key is not ready yet. Please wait a moment.",
      );
    socketRef.current?.send(
      JSON.stringify({
        type: "message",
        ...(await encryptMessage(
          encryptionKeyRef.current,
          inputMessage.trim(),
        )),
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
        encryptionKeyRef.current = sharedKey;
      }
    }
    deriveEncryptionKey();
  }, [keys, partnerPublicKey]);

  useEffect(() => {
    if (!keys || !window) return;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    socketRef.current = new WebSocket(`${protocol}://${host}/api/ws`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      socketRef.current?.send(
        JSON.stringify({ type: "join", roomId, publicKey: keys?.publicKey }),
      );
    };

    socketRef.current.onmessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data.toString());
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
        if (!encryptionKeyRef.current) return;
        try {
          const decryptedMessage = await decryptMessage(
            encryptionKeyRef.current,
            data?.iv,
            data?.cipherText,
          );
          setMessages((prev) => [
            ...prev,
            {
              text: decryptedMessage,
              sender: "partner",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        } catch (err) {
          console.log("Failed to decrypt message", err);
        }
      }

      if (data?.type === "peer-public-key") {
        setPartnerPublicKey(data?.publicKey);
      }

      if (data?.type === "typing") {
        setPartnerTyping(data?.isTyping);
      }

      if (data?.type === "webrtc-offer") {
        setCallState("incoming");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });

        stream.getTracks().forEach((t) => peerConnection.addTrack(t, stream));

        peerConnection.ontrack = (event) => {
          const audioEl = document.getElementById(
            "remoteAudio",
          ) as HTMLAudioElement;
          if (audioEl) {
            audioEl.srcObject = event.streams[0];
            audioEl.play().catch((e) => console.log("Autoplay prevented:", e));
          }
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.send(
              JSON.stringify({
                type: "webrtc-ice",
                candidate: event.candidate,
              }),
            );
          }
        };

        peerConnectionRef.current = peerConnection;
        localStreamRef.current = stream;

        peerConnection.oniceconnectionstatechange = () => {
          console.log("ICE state:", peerConnection.iceConnectionState);
          if (peerConnection.iceConnectionState === "connected") {
            console.log("✅ ICE connected - audio should flow");
          }
          if (
            peerConnection.iceConnectionState === "disconnected" ||
            peerConnection.iceConnectionState === "failed" ||
            peerConnection.iceConnectionState === "closed"
          ) {
            hangCall();
            toast.info("Call disconnected");
          }
        };
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.sdp),
        );

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socketRef.current?.send(
          JSON.stringify({
            type: "webrtc-answer",
            sdp: answer,
          }),
        );
      }

      if (data?.type === "webrtc-answer") {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
          );
          setCallState("active");
        }
      }

      if (data?.type === "webrtc-ice") {
        if (peerConnectionRef.current && data.candidate) {
          const candidate = new RTCIceCandidate(data.candidate);
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
      }

      if (data?.type === "call-ended") {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
          localStreamRef.current = null;
        }
        const audioEl = document.getElementById(
          "remoteAudio",
        ) as HTMLAudioElement;
        if (audioEl) audioEl.srcObject = null;
        setCallState("idle");
        toast.info("Call ended by partner");
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerJoined, partnerTyping]);

  useEffect(() => {
    if (inputMessage.trim()) {
      setIsTyping(true);
      socketRef.current?.send(
        JSON.stringify({ type: "typing", isTyping: true }),
      );
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socketRef.current?.send(
          JSON.stringify({ type: "typing", isTyping: false }),
        );
      }, 2000);
    } else {
      setIsTyping(false);
      socketRef.current?.send(
        JSON.stringify({ type: "typing", isTyping: false }),
      );
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [inputMessage]);

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
        callState={callState}
        onStartCall={startCall}
        onAnswerCall={() => setCallState("active")}
        onRejectCall={() => setCallState("idle")}
        onEndCall={hangCall}
      />
      <audio id="remoteAudio" autoPlay />

      <main className="relative z-10 flex-1 flex overflow-hidden w-full mx-auto p-2 sm:p-3 md:p-6 xl:p-8 2xl:p-10 min-h-0">
        <div className="flex-1 flex flex-col min-w-0 bg-white/70 dark:bg-zinc-950/20 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none overflow-hidden">
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
                partnerTyping={partnerTyping}
              />
            )}
          </AnimatePresence>
        </div>

        <ChatRoomInformation
          roomId={roomId}
          isPartnerJoined={isPartnerJoined}
          totalUser={totalUser}
          createdTime={createdTime}
          myPublicKey={keys?.publicKey}
          partnerPublicKey={partnerPublicKey}
        />
      </main>
    </div>
  );
}
