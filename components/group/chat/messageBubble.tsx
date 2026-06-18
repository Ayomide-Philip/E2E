import { Message } from "@/app/(chatting)/group/[id]/page";
import { motion } from "framer-motion";
import { Check, Shield } from "lucide-react";
export default function MessageBubble({ message }: { message: Message }) {
  const isMe = message?.sender === "me";
  const isSystem = message?.sender === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center py-1.5"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-zinc-100/70 dark:bg-zinc-800/50 px-3 py-1.5 backdrop-blur-sm">
          <Shield className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
            {message?.text}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
      className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
        isMe ? "self-end items-end" : "self-start items-start"
      }`}
    >
      <div
        className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-full ${
          isMe
            ? "bg-zinc-900 dark:bg-white text-white dark:text-black rounded-tr-xs shadow-xs"
            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/50 dark:border-zinc-800/85 rounded-tl-xs shadow-xs"
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message?.text}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-0.5 ${
            isMe
              ? "text-white/50 dark:text-black/40"
              : "text-zinc-400 dark:text-zinc-500"
          }`}
        >
          <span className="text-[10px]">{message?.timestamp}</span>
          {isMe && <Check className="h-3 w-3" />}
        </div>
      </div>
    </motion.div>
  );
}
