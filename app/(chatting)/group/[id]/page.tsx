"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
export default function Page() {
  const { id }: { id: string } = useParams();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    socketRef.current = new WebSocket(`${protocol}://${host}/api/ws`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
      socketRef.current?.send(
        JSON.stringify({ type: "join-room", roomId: id }),
      );
    };
  }, [id]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Group ID: {id}</h1>
      <p className="text-lg text-gray-600">
        This is the group page for the room with ID: {id}. You can implement
        your chat functionality here.
      </p>
    </div>
  );
}
