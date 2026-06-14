"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import NavBar from "@/components/navbar";
import CreateRoomCard from "@/components/group/create/createRoomCard";
import CreateRoomModal from "@/components/group/create/roomModal";
import JoinRoomCard from "@/components/group/create/roomCard";

export default function GroupPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <NavBar />
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-10 sm:pt-7">
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

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
          <CreateRoomCard onCreateRoom={() => setModalOpen(true)} />
          <JoinRoomCard />
        </section>
      </main>

      <CreateRoomModal
        key={modalOpen ? "open" : "closed"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
