import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Mic, Volume2, X } from "lucide-react";
import { useEffect } from "react";

export default function CallOverlay({
  callState,
  onAnswerCall,
  onRejectCall,
  onEndCall,
}: {
  callState: "idle" | "calling" | "incoming" | "active";
  onAnswerCall: () => void;
  onRejectCall: () => void;
  onEndCall: () => void;
}) {
  useEffect(() => {}, []);
  return (
    <AnimatePresence>
      {callState !== "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Phone className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                {callState === "calling" && "Calling..."}
                {callState === "incoming" && "Incoming Call"}
                {callState === "active" && "Call Connected"}
              </h3>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {callState === "calling" && "Ringing the other peer..."}
                {callState === "incoming" && "Someone wants to talk to you"}
                {callState === "active" && "You are on a secure E2E call"}
              </p>
            </div>

            {callState === "active" && (
              <div className="flex items-center justify-center gap-6 pb-4">
                <button className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center cursor-pointer">
                  <Mic className="h-5 w-5" />
                </button>
                <button className="w-14 h-14 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/25">
                  <PhoneOff className="h-5 w-5" />
                </button>
                <button className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center cursor-pointer">
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="p-4 pt-0 flex items-center justify-center gap-4">
              {callState === "calling" && (
                <button
                  onClick={onEndCall}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              )}

              {callState === "incoming" && (
                <>
                  <button
                    onClick={onRejectCall}
                    className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <PhoneOff className="h-4 w-4" />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={onAnswerCall}
                    className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-emerald-500/25"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Accept</span>
                  </button>
                </>
              )}

              {callState === "active" && (
                <button
                  onClick={onEndCall}
                  className="flex items-center justify-center gap-2 h-11 px-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <PhoneOff className="h-4 w-4" />
                  <span>End Call</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
