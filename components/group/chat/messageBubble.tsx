import { motion } from "framer-motion";
import { Check, ImageIcon, Link2, Shield } from "lucide-react";
export default function MessageBubble({ message }: { message: Message }) {
  const isMe = message.sender === "me";
  const isSystem = message.sender === "system";

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
            {message.text}
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
        {message.type === "image" ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-center h-28 sm:h-32 w-full rounded-xl bg-linear-to-br from-purple-400 via-pink-400 to-orange-300 dark:from-purple-600 dark:via-pink-600 dark:to-orange-500">
              <ImageIcon className="h-6 sm:h-8 w-6 sm:w-8 text-white/70" />
            </div>
            <p className="whitespace-pre-wrap wrap-break-word">
              {message.text}
            </p>
          </div>
        ) : message.type === "link" ? (
          <div className="space-y-1.5">
            <p className="whitespace-pre-wrap wrap-break-word">
              {message.text}
            </p>
            <a
              href={message.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 rounded-xl p-2 text-[10px] sm:text-xs ${
                isMe
                  ? "bg-white/15 text-white hover:bg-white/20"
                  : "bg-zinc-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              } transition-colors duration-200`}
            >
              <Link2 className="h-3 sm:h-3.5 w-3 sm:w-3.5 shrink-0" />
              <span className="truncate">{message.linkUrl}</span>
            </a>
          </div>
        ) : (
          <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
        )}
        <div
          className={`flex items-center justify-end gap-1 mt-0.5 ${
            isMe ? "text-white/50" : "text-zinc-400 dark:text-zinc-500"
          }`}
        >
          <span className="text-[10px]">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isMe && <Check className="h-3 w-3" />}
        </div>
      </div>
    </motion.div>
  );
}

type Message = {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  timestamp: Date;
  type?: "text" | "image" | "link";
  linkUrl?: string;
};
