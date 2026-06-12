import { Lock } from "lucide-react";
export default function ChatRoomInformation({
  roomId,
  isPartnerJoined,
  totalUser,
  createdTime,
}: {
  roomId: string;
  isPartnerJoined: boolean;
  totalUser: number;
  createdTime: string;
}) {
  return (
    <aside className="hidden md:flex flex-col w-68 shrink-0 pl-4 h-full min-h-0">
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="bg-white/80 dark:bg-zinc-950/40 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shrink-0">
          <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
            Session Info
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-zinc-500 dark:text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Room ID
                </p>
                <p
                  className="text-[10px] font-mono font-bold text-zinc-800 dark:text-zinc-200 truncate mt-0.5 select-all"
                  title={roomId}
                >
                  {roomId}
                </p>
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800/50" />

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Encryption
                </p>
                <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  AES-GCM 256-bit
                </p>
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800/50" />

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-zinc-500 dark:text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Participants
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                    {isPartnerJoined ? `${totalUser} / 2` : `${totalUser} / 2`}
                  </p>
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPartnerJoined ? "bg-emerald-400" : "bg-amber-400"}`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isPartnerJoined ? "bg-emerald-500" : "bg-amber-500"}`}
                    />
                  </span>
                  <span
                    className={`text-[9px] font-semibold ${isPartnerJoined ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
                  >
                    {isPartnerJoined ? "Full" : "Waiting"}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800/50" />

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-zinc-500 dark:text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Established
                </p>
                <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {createdTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/8 dark:to-teal-500/3 border border-emerald-500/20 dark:border-emerald-500/15 rounded-2xl p-4 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 dark:bg-emerald-400/15 flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400">
              End-to-End Encrypted
            </p>
          </div>
          <p className="text-[9px] text-emerald-700/80 dark:text-emerald-500 leading-relaxed">
            Keys are derived locally in your browser. The server only relays
            ciphertext — plaintext is never exposed.
          </p>
        </div>

        <div className="mt-auto bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200/60 dark:border-zinc-800/40 rounded-2xl p-3.5 shrink-0">
          <div className="flex items-center gap-1.5 mb-1">
            <svg
              className="w-3 h-3 text-zinc-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Ephemeral Session
            </p>
          </div>
          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
            No logs, no database. All data is purged the moment both
            participants leave.
          </p>
        </div>
      </div>
    </aside>
  );
}
