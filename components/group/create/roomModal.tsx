import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  X,
  Loader2,
  Check,
  Hash,
  Copy,
  DoorOpen,
  Sparkles,
} from "lucide-react";
import generateRoomId from "@/lib/generatingRoomId";

export default function CreateRoomModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "creating" | "done">("idle");
  const [roomId, setRoomId] = useState<string | null>(null);
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const createdRef = useRef(false);

  // Auto-create the room as soon as the modal opens
  useEffect(() => {
    if (open && !createdRef.current) {
      createdRef.current = true;
      setPhase("creating");
      const id = generateRoomId();
      setTimeout(() => {
        setRoomId(id);
        setPhase("done");
        toast.success("Room created successfully!");
      }, 1200);
    }
    // Reset the ref when modal closes so it can create again next time
    if (!open) {
      createdRef.current = false;
    }
  }, [open]);

  function handleCreate() {
    setPhase("creating");
    const id = generateRoomId();
    setTimeout(() => {
      setRoomId(id);
      setPhase("done");
      toast.success("Room created successfully!");
    }, 1200);
  }

  function handleCopyLink() {
    if (!roomId) return;
    const link = `${window.location.origin}/group/${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Room link copied to clipboard!");
    });
  }

  function handleEnterRoom() {
    if (!roomId) return;
    router.push(`/group/${roomId}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>

            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                  Create a New Room
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 text-center max-w-xs">
                  Generate a secure, encrypted room to start a private
                  conversation.
                </p>
                <motion.button
                  onClick={handleCreate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-300 shadow-md"
                >
                  <Sparkles className="h-4 w-4" />
                  Create Room
                </motion.button>
              </motion.div>
            )}

            {phase === "creating" && (
              <motion.div
                key="creating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                  Creating Room
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Generating a secure room ID...
                </p>
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div
                key="created"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                  Room Created!
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                  Your secure room is ready. Share the link or room ID with
                  others.
                </p>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 p-5 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
                      <Hash className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                        ID: {roomId}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <motion.button
                      onClick={handleCopyLink}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy Room Link
                    </motion.button>
                    <motion.button
                      onClick={handleEnterRoom}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white py-2.5 text-xs font-semibold text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-300"
                    >
                      <DoorOpen className="h-3.5 w-3.5" />
                      Enter Room
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
                >
                  Close
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
