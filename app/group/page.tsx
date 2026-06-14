"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  LogIn,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Users,
  CalendarDays,
  Lock,
  Globe,
  Copy,
  ArrowRight,
  DoorOpen,
  Hash,
  X,
  Loader2,
  Check,
  Sparkles,
  Building2,
} from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/navbar";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

type Room = {
  id: string;
  name: string;
  description: string;
  participants: number;
  createdAt: string;
  isPrivate: boolean;
};

type FilterOption = "all" | "public" | "private";
type SortOption = "newest" | "oldest" | "most-active" | "name";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_ROOMS: Room[] = [
  {
    id: "a1b2c3d4",
    name: "Tech Talk",
    description: "Discuss the latest in tech, AI, and software development.",
    participants: 12,
    createdAt: "2026-06-10",
    isPrivate: false,
  },
  {
    id: "e5f6g7h8",
    name: "Book Club",
    description: "Monthly book discussions and reading recommendations.",
    participants: 8,
    createdAt: "2026-06-08",
    isPrivate: false,
  },
  {
    id: "i9j0k1l2",
    name: "Project Alpha",
    description: "Private team collaboration for Project Alpha.",
    participants: 5,
    createdAt: "2026-06-05",
    isPrivate: true,
  },
  {
    id: "m3n4o5p6",
    name: "Gaming Squad",
    description: "Find teammates and talk about your favourite games.",
    participants: 24,
    createdAt: "2026-06-01",
    isPrivate: false,
  },
  {
    id: "q7r8s9t0",
    name: "Design Critique",
    description:
      "Share your work and get honest feedback from fellow designers.",
    participants: 15,
    createdAt: "2026-05-28",
    isPrivate: false,
  },
  {
    id: "u1v2w3x4",
    name: "Startup Hub",
    description: "Entrepreneurs and founders sharing ideas and advice.",
    participants: 9,
    createdAt: "2026-05-20",
    isPrivate: true,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateRoomId(): string {
  return Array.from({ length: 8 }, () =>
    "abcdefghijklmnopqrstuvwxyz0123456789".charAt(
      Math.floor(Math.random() * 36),
    ),
  ).join("");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

function CreateRoomCard({ onCreateRoom }: { onCreateRoom: () => void }) {
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

function JoinRoomCard() {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleJoin() {
    const trimmed = roomId.trim();
    if (!trimmed) {
      setError("Please enter a room ID");
      return;
    }
    if (trimmed.length < 6) {
      setError("Room ID must be at least 6 characters");
      return;
    }
    setError("");
    router.push(`/chat/${trimmed}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl p-6 sm:p-8 hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/30 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5 dark:from-purple-500/10 dark:via-transparent dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 group-hover:scale-110 transition-all duration-500">
          <LogIn className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          Join Room
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
          Have a room ID? Enter it below to join an existing secure chat room.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Enter room ID..."
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className={`w-full rounded-xl border bg-white/50 dark:bg-zinc-900/50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                error
                  ? "border-red-300 dark:border-red-800 focus:ring-red-400/50"
                  : "border-zinc-200 dark:border-zinc-700 focus:ring-purple-500/50 focus:border-purple-400 dark:focus:border-purple-600"
              }`}
            />
          </div>
          <motion.button
            onClick={handleJoin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md shadow-purple-500/25"
          >
            <ArrowRight className="h-4 w-4" />
            Join
          </motion.button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function SearchBar({
  search,
  setSearch,
  filter,
  setFilter,
  sort,
  setSort,
}: {
  search: string;
  setSearch: (v: string) => void;
  filter: FilterOption;
  setFilter: (v: FilterOption) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
        <input
          type="text"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700/60 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/50 dark:focus:ring-zinc-600/50 focus:border-zinc-300 dark:focus:border-zinc-600 transition-all duration-300"
        />
      </div>
      <div className="flex gap-3">
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterOption)}
            className="appearance-none rounded-xl border border-zinc-200 dark:border-zinc-700/60 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm pl-10 pr-8 py-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400/50 dark:focus:ring-zinc-600/50 transition-all duration-300 cursor-pointer min-w-32.5"
          >
            <option value="all">All Rooms</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="relative">
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none rounded-xl border border-zinc-200 dark:border-zinc-700/60 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm pl-10 pr-8 py-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400/50 dark:focus:ring-zinc-600/50 transition-all duration-300 cursor-pointer min-w-32.5"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most-active">Most Active</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

function RoomCard({
  room,
  index,
  onJoin,
}: {
  room: Room;
  index: number;
  onJoin: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm p-5 hover:shadow-lg hover:shadow-zinc-200/20 dark:hover:shadow-black/30 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-400"
    >
      <div className="absolute inset-0 bg-linear-to-br from-zinc-100/50 via-transparent to-transparent dark:from-white/2 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white truncate">
              {room.name}
            </h3>
          </div>
          <span
            className={`ml-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium shrink-0 ${
              room.isPrivate
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            }`}
          >
            {room.isPrivate ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Globe className="h-3 w-3" />
            )}
            {room.isPrivate ? "Private" : "Public"}
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed line-clamp-2">
          {room.description}
        </p>

        <div className="flex items-center gap-4 text-[11px] text-zinc-400 dark:text-zinc-500 mb-4">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {room.participants}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(room.createdAt)}
          </span>
        </div>

        <motion.button
          onClick={onJoin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/80 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
        >
          <DoorOpen className="h-3.5 w-3.5" />
          Join Room
        </motion.button>
      </div>
    </motion.div>
  );
}

function EmptyState({ onCreateRoom }: { onCreateRoom: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="col-span-full flex flex-col items-center justify-center py-16 sm:py-24"
    >
      <motion.div
        animate={{
          y: [-6, 6, -6],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800"
      >
        <Building2 className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
      </motion.div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        No rooms found
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 text-center max-w-sm">
        There are no rooms matching your search. Be the first to create one!
      </p>
      <motion.button
        onClick={onCreateRoom}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-300 shadow-md"
      >
        <Plus className="h-4 w-4" />
        Create Room
      </motion.button>
    </motion.div>
  );
}

// ─── Create Room Modal ──────────────────────────────────────────────────────

type ModalStep = "form" | "created";

function CreateRoomModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<ModalStep>("form");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
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
    const link = `${window.location.origin}/chat/${createdRoom.id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Room link copied to clipboard!");
    });
  }

  function handleEnterRoom() {
    if (!createdRoom) return;
    router.push(`/chat/${createdRoom.id}`);
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
                      Description{" "}
                      <span className="text-zinc-400 dark:text-zinc-500 font-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      placeholder="What's this room about?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-600 transition-all duration-300 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      {isPrivate ? (
                        <Lock className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Globe className="h-5 w-5 text-emerald-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {isPrivate ? "Private Room" : "Public Room"}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                          {isPrivate
                            ? "Only people with the link can join"
                            : "Anyone can discover and join"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        isPrivate
                          ? "bg-amber-500"
                          : "bg-zinc-300 dark:bg-zinc-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                          isPrivate ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
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

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function GroupPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const filteredRooms = useMemo(() => {
    let rooms = [...MOCK_ROOMS];

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      rooms = rooms.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
    }

    // Filter by privacy
    if (filter === "public") rooms = rooms.filter((r) => !r.isPrivate);
    else if (filter === "private") rooms = rooms.filter((r) => r.isPrivate);

    // Sort
    switch (sort) {
      case "newest":
        rooms.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        rooms.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "most-active":
        rooms.sort((a, b) => b.participants - a.participants);
        break;
      case "name":
        rooms.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return rooms;
  }, [search, filter, sort]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Background pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "radial-gradient(circle, #27272a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <NavBar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-24 sm:pt-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
            Groups
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Create or join secure, end-to-end encrypted chat rooms. Share a link
            and start a private conversation with anyone — no account needed.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
          <CreateRoomCard onCreateRoom={() => setModalOpen(true)} />
          <JoinRoomCard />
        </section>

        {/* Search Section */}
        <section className="mb-8">
          <SearchBar
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
          />
        </section>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Available Rooms
          </h2>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {filteredRooms.length}{" "}
            {filteredRooms.length === 1 ? "room" : "rooms"} found
          </span>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room, i) => (
              <RoomCard
                key={room.id}
                room={room}
                index={i}
                onJoin={() => router.push(`/chat/${room.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState onCreateRoom={() => setModalOpen(true)} />
        )}
      </main>

      {/* Create Room Modal */}
      <CreateRoomModal
        key={modalOpen ? "open" : "closed"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
