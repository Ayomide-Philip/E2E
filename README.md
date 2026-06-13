# End-to-End Encrypted Chat App

A secure, real-time chat application built with **Next.js**, **WebSockets**, and **AES-GCM 256-bit** encryption. Messages are encrypted in the browser before being sent — the server only relays ciphertext.

## Features

### 🔐 End-to-End Encryption

- Elliptic Curve Diffie-Hellman (ECDH) key exchange for shared secret derivation
- AES-GCM 256-bit symmetric encryption for all messages
- Keys are generated locally in the browser — never sent to the server
- Public key fingerprints displayed in the sidebar for identity verification

### 💬 Real-Time Messaging

- WebSocket-based instant messaging with low latency
- Auto-scroll to the latest message
- Multi-line message input with Shift+Enter for new lines and auto-resize textarea
- Long messages wrap properly with no horizontal overflow

### ⌨️ Typing Indicator

- Real-time typing detection with 2-second debounce
- Animated bouncing dots styled like a regular message bubble (WhatsApp-style)
- Typing events sent via WebSocket so both peers see each other's status

### 🎨 Responsive Design

- Fully responsive across mobile, tablet, and desktop breakpoints
- Collapsible sidebar (hidden on mobile) showing session info, fingerprints, and encryption details
- Full-width layout on large screens with adaptive padding
- Touch-friendly button sizing and spacing on mobile

### 🌗 Dark Mode

- System-aware theme with manual toggle
- Dark mode support across all components with tailored color schemes

### 🧹 Ephemeral Sessions

- No database or server-side logging
- All data is purged when both participants leave the room
- Sessions are temporary — no message history is persisted

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Encryption:** Web Crypto API (ECDH + AES-GCM)
- **Real-Time:** WebSockets
- **Icons:** Lucide React
