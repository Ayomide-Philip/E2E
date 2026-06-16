import { AnimatePresence, motion } from "framer-motion";
import { Shield, Send } from "lucide-react";
import MessageBubble from "./messageBubble";
import TypingDots from "@/components/typingDot";
import { useRef, useEffect } from "react";

export default function MessageActive({
  messages,
  isPartnerTyping,
  input,
  setInput,
  handleKeyDown,
  handleSend,
}: {
  messages: Message[];
  isPartnerTyping: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [input]);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 dark:bg-emerald-400/5 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl text-[10px] sm:text-xs max-w-[90%] sm:max-w-md text-center shadow-xs">
            <Shield className="h-3 sm:h-3.5 w-3 sm:w-3.5 shrink-0" />
            <span>End-to-end encrypted chat</span>
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="flex flex-col gap-4"
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </motion.div>

        <AnimatePresence>{isPartnerTyping && <TypingDots />}</AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 sm:p-3 md:p-4 bg-linear-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 dark:to-transparent shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/60">
        <div className="flex items-center gap-1.5 sm:gap-2 max-w-4xl mx-auto bg-white dark:bg-zinc-900 backdrop-blur-md rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none p-1 sm:p-1.5">
          <textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-transparent border-0 outline-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none min-h-9 sm:min-h-10 max-h-40 leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 ${
              input.trim()
                ? "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-100 cursor-pointer shadow-sm active:scale-[0.96]"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-60"
            }`}
          >
            <Send className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </>
  );
}

type Message = {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  timestamp: string;
  type?: "text" | "image" | "link";
  linkUrl?: string;
};
