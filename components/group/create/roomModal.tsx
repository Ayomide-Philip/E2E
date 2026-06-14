import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Sparkles,
  X,
  Loader2,
  Check,
  Hash,
  Copy,
  DoorOpen,
  Lock,
  Globe,
} from "lucide-react";
import generateRoomId from "@/lib/generatingRoomId";

export default function CreateRoomModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"form" | "created">("form");
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [groupPassword, setGroupPassword] = useState("");
  const [createdRoom, setCreatedRoom] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  function handleCreate() {
    if (!name.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    if (!groupPassword.trim()) {
      toast.error("Please enter a password for the room");
      return;
    }
    setIsCreating(true);
    setTimeout(() => {
      const newRoom = {
        id: generateRoomId(),
        name: name.trim(),
      };
      setCreatedRoom(newRoom);
      setIsCreating(false);
      setStep("created");
      toast.success("Room created successfully!");
    }, 1200);
  }

  function handleCopyLink() {
    if (!createdRoom) return;
    const link = `${window.location.origin}/group/${createdRoom.id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Room link copied to clipboard!");
    });
  }

  function handleEnterRoom() {
    if (!createdRoom) return;
    router.push(`/group/${createdRoom?.id}`);
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

            {step === "form" ? (
              <>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                  Create a Room
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                  Set up a new secure chat room for your group.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Room Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gaming Squad"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-600 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Room Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter a room password"
                      value={groupPassword}
                      onChange={(e) => setGroupPassword(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-600 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleCreate}
                    disabled={isCreating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl bg-zinc-900 dark:bg-white py-2.5 text-sm font-semibold text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Create Room
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <motion.div
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
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          {createdRoom?.name}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                          ID: {createdRoom?.id}
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
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
