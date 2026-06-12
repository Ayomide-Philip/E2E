import Link from "next/link";
import { ArrowLeft, Check, Copy } from "lucide-react";
import Toggle from "@/components/Toggle";
export default function ChatNavBar({
  roomId,
  isPartnerJoined,
  handleCopy,
  copied,
}: {
  roomId: string;
  isPartnerJoined: boolean;
  handleCopy: () => void;
  copied: boolean;
}) {
  return (
    <header className="relative z-20 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/20 backdrop-blur-2xl px-4 py-3 shrink-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            title="Leave Room"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
              Private
            </span>
            <span className="bg-linear-to-br from-blue-500 to-purple-600 text-[10px] text-white px-2 py-0.5 rounded-full font-semibold">
              E2E
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900/60 text-zinc-650 dark:text-zinc-350 text-xs font-mono rounded-full border border-zinc-200/85 dark:border-zinc-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-650" />
            <span className="truncate max-w-28" title={roomId}>
              {roomId}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              isPartnerJoined
                ? "bg-emerald-500/10 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30"
                : "bg-amber-500/10 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isPartnerJoined ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"}`}
            />
            <span>{isPartnerJoined ? "Connected" : "Waiting for peer..."}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              copied
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "bg-white dark:bg-zinc-900 text-zinc-650 dark:text-zinc-350 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850"
            }`}
            title="Copy Room Link"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>

          <div className="p-2 rounded-full border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all flex items-center justify-center">
            <Toggle />
          </div>
        </div>
      </div>
    </header>
  );
}
