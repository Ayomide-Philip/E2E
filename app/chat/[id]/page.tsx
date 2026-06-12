"use client";

import { ChatRoom } from "@/components/chat/chatroom";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  
  return <ChatRoom roomId={id} />;
}
