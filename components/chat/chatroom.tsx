import { useEffect, useState } from "react";

export function ChatRoom({ roomId }: { roomId: string }) {
  const [roomLink, setRoomLink] = useState("");
  
  useEffect(() => {
    setRoomLink(`${window.location.origin}/chat/${roomId}`);
  }, [roomId]);
  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-sm text-blue-400">Waiting for peer…</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono hidden sm:block">
            {roomLink}
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
            Copy link
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3">
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
          <p className="text-zinc-400 text-sm max-w-xs">
            Share the link above with someone to start chatting anonymously.
          </p>
        </div>
      </main>

      <footer className="px-4 py-3 border-t border-zinc-800 bg-zinc-900 shrink-0 flex items-center gap-2">
        <input
          type="text"
          placeholder="Waiting for peer…"
          disabled
          className="flex-1 px-4 py-2 text-sm rounded-xl bg-zinc-800 text-zinc-400 placeholder-zinc-600 border border-zinc-700 outline-none"
        />
        <button
          disabled
          className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white opacity-40 cursor-not-allowed"
        >
          Send
        </button>
      </footer>
    </div>
  );
}