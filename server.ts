import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import next from "next";
import { parse } from "node:url";
import { Socket } from "node:net";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const rooms: Record<string, Set<WebSocket>> = {};
const clientsRoom = new Map<WebSocket, string>();

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    handle(req, res, parse(req.url || "", true));
  });

  const wss: WebSocketServer = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws: WebSocket) => {
    console.log("WebSocket connection established");
    ws.on("message", (message: string) => {
      const m = JSON.parse(message.toString());

      console.log("Received message:", m);
      if (m?.type === "join") {
        const { roomId } = m;

        if (!rooms[roomId]) {
          rooms[roomId] = new Set();
        }

        if (rooms[roomId].size >= 2) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Room is full",
            }),
          );
          ws.close();
          return;
        }

        rooms[roomId].add(ws);
        clientsRoom.set(ws, roomId);
        console.log(`Room ${roomId}:`, rooms[roomId].size);
      }
    });

    ws.on("close", () => {
      const roomId = clientsRoom.get(ws);

      if (!roomId) return;

      if (roomId && rooms[roomId]) {
        rooms[roomId].delete(ws);
      }

      if (rooms[roomId].size === 0) {
        delete rooms[roomId];
      }

      clientsRoom.delete(ws);
      console.log("WebSocket connection closed");
    });
  });

  server.on("upgrade", (req: IncomingMessage, socket: Socket, head: Buffer) => {
    const { pathname } = parse(req.url || "", true);

    if (pathname === "/_next/webpack-hmr") {
      app.getUpgradeHandler()(req, socket, head);
    }

    if (pathname === "/api/ws") {
      wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
});
