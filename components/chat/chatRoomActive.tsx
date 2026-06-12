import { motion } from "framer-motion";
import { Send, Shield } from "lucide-react";
import { RefObject } from "react";
export default function ChatRoomActive({
  messages,
  isPartnerJoined,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  messagesEndRef,
}: {
  messages: { sender: "me" | "partner"; text: string; time: string }[];
  isPartnerJoined: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.div
      key="chat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-h-0"
    >
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 dark:bg-emerald-400/5 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl text-xs max-w-md text-center shadow-xs">
            <Shield className="h-3.5 w-3.5 shrink-0" />
            <span>
              This room is fully encrypted end-to-end. No database or server
              logs are kept.
            </span>
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
          {messages.map((msg, idx) => {
            const isMe = msg.sender === "me";
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                  isMe ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-black rounded-tr-xs shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/50 dark:border-zinc-800/85 rounded-tl-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 px-1.5 font-medium">
                  {msg.time}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 md:p-4 bg-linear-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 dark:to-transparent shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/60">
        <div className="flex items-center gap-2 max-w-4xl mx-auto bg-white dark:bg-zinc-900 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none p-1.5">
          <input
            type="text"
            placeholder="Type a message..."
            disabled={!isPartnerJoined}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && inputMessage.trim()) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 px-4 py-2.5 text-sm bg-transparent border-0 outline-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 cursor-text disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !isPartnerJoined}
            className={`h-10 px-4 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 shrink-0 ${
              inputMessage.trim() && isPartnerJoined
                ? "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-100 cursor-pointer shadow-sm"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-60"
            }`}
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
