import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
export default function CreateRoomCard({
  onCreateRoom,
}: {
  onCreateRoom: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl p-6 sm:p-8 hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/30 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-110 transition-all duration-500">
          <Plus className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          Create Room
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
          Start a new encrypted chat room. Share the link with anyone to begin a
          private conversation instantly.
        </p>
        <motion.button
          onClick={onCreateRoom}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-300 shadow-md"
        >
          <Sparkles className="h-4 w-4" />
          Create Room
        </motion.button>
      </div>
    </motion.div>
  );
}
