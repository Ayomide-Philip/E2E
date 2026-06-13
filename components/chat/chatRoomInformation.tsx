import { getFingerprint } from "@/lib/crypto";
import { Lock, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
export default function ChatRoomInformation({
  roomId,
  isPartnerJoined,
  totalUser,
  createdTime,
  myPublicKey = "",
  partnerPublicKey,
}: {
  roomId: string;
  isPartnerJoined: boolean;
  totalUser: number;
  createdTime: string;
  myPublicKey?: string;
  partnerPublicKey?: string | null;
}) {
  const [myFingerprint, setMyFingerprint] = useState("");
  const [partnerFingerprint, setPartnerFingerprint] = useState("");

  useEffect(() => {
    async function fetchFingerprint() {
      if (myPublicKey) {
        const fingerprint = await getFingerprint(myPublicKey);
        setMyFingerprint(fingerprint);
      }
    }

    fetchFingerprint();
  }, [myPublicKey]);

  useEffect(() => {
    async function fetchPartnerFingerprint() {
      if (partnerPublicKey) {
        const fingerprint = await getFingerprint(partnerPublicKey);
        setPartnerFingerprint(fingerprint);
      }
    }

    fetchPartnerFingerprint();
  }, [partnerPublicKey]);

  return (
    <aside className="hidden md:flex flex-col w-68 xl:w-80 shrink-0 pl-4 h-full min-h-0">
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="bg-white/80 dark:bg-zinc-950/40 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shrink-0">
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
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
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Room ID
                </p>
                <p
                  className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 truncate mt-0.5 select-all"
                  title={roomId}
                >
                  {roomId}
                </p>
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800/50" />

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Encryption
                </p>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  AES-GCM 256-bit
                </p>
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800/50" />

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400"
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
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Participants
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
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
                    className={`text-[10px] font-semibold ${isPartnerJoined ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
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
                  className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400"
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
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Established
                </p>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {createdTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-zinc-950/40 backdrop-blur-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shrink-0">
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
            Fingerprints
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <KeyRound className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  My Fingerprint
                </p>
                <p
                  className="text-[10px] font-mono font-medium text-zinc-700 dark:text-zinc-300 mt-0.5 break-all select-all leading-relaxed"
                  title={myPublicKey}
                >
                  {myFingerprint || "No fingerprint available"}
                </p>
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800/50" />

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Partner&apos;s Fingerprint
                </p>
                {partnerPublicKey ? (
                  <p
                    className="text-[10px] font-mono font-medium text-zinc-700 dark:text-zinc-300 mt-0.5 break-all select-all leading-relaxed"
                    title={partnerPublicKey}
                  >
                    {partnerFingerprint || "No fingerprint available"}
                  </p>
                ) : (
                  <p className="text-[10px] font-medium text-amber-500 dark:text-amber-400 mt-0.5 italic">
                    Awaiting peer connection...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
