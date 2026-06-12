import { motion } from "framer-motion";
import { Lock, Copy, Check } from "lucide-react";
export default function WaitingChatRoom({
  roomLink,
  handleCopy,
  copied,
}: {
  roomLink: string;
  handleCopy: () => void;
  copied: boolean;
}) {
  return (
    <motion.div
      key="waiting"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center"
    >
      <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
          }}
          className="absolute w-36 h-36 rounded-full border border-blue-500/30 dark:border-blue-400/25"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
            delay: 0.6,
          }}
          className="absolute w-28 h-28 rounded-full border border-purple-500/35 dark:border-purple-400/25"
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
            delay: 1.2,
          }}
          className="absolute w-20 h-20 rounded-full border border-zinc-200 dark:border-zinc-800"
        />
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{
            repeat: Infinity,
            duration: 4.5,
            ease: "easeInOut",
          }}
          className="absolute w-14 h-14 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25 text-white z-10"
        >
          <Lock className="h-6 w-6" />
        </motion.div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
        Waiting for someone to join...
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
        Share this link with a friend to start chatting. The session remains
        temporary and encrypted.
      </p>

      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 w-full max-w-md text-left shadow-xs">
        <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-wider">
          Shareable Room Link
        </span>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-1.5 shadow-xs">
          <input
            type="text"
            readOnly
            value={roomLink}
            className="flex-1 text-xs font-mono text-zinc-600 dark:text-zinc-350 px-2 select-all outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              copied
                ? "bg-emerald-500 text-white shadow-xs"
                : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
