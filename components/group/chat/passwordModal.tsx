"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

type PasswordModalProps = {
  open: boolean;
  roomId: string;
  onPasswordSubmit: (password: string) => void;
  onClose: () => void;
  error?: string | null;
  isLoading?: boolean;
  groupPassword: string | null;
  setGroupPassword: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function PasswordModal({
  open,
  roomId,
  onPasswordSubmit,
  onClose,
  error,
  isLoading = false,
  groupPassword,
  setGroupPassword,
}: PasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!groupPassword?.trim()) return;
    onPasswordSubmit(groupPassword.trim());
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl"
          >
            {/* Icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
              <Lock className="h-6 w-6 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
              Room Password Required
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              This room is protected. Enter the password to join.
            </p>

            {/* Room ID hint */}
            <div className="mb-5 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 truncate">
                Room: {roomId}
              </p>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter room password"
                  value={groupPassword || ""}
                  onChange={(e) => setGroupPassword(e.target.value)}
                  autoFocus
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 pl-4 pr-11 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 dark:focus:border-violet-600 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex items-center gap-2 text-red-500 dark:text-red-400 text-xs"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={!groupPassword?.trim() || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Join Room
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
}
