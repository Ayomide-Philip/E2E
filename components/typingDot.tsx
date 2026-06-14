import { motion } from "framer-motion";
export default function TypingDots() {
  return (
    <div className="flex flex-col self-start items-start max-w-[80%] sm:max-w-[70%]">
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/85 rounded-tl-xs shadow-xs">
        <div className="flex items-center gap-1">
          {[0, 0.2, 0.4].map((delay) => (
            <motion.span
              key={delay}
              animate={{ y: [0, -4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                ease: "easeInOut",
                delay,
              }}
              className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
