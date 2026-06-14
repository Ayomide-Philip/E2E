import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import next from "next";
import { parse } from "node:url";
import { Socket } from "node:net";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const rooms: Record<string, Set<WebSocket>> = {};
const clientsRoom = new Map<WebSocket, string>();
const groups: Record<string, { name: string; password?: string }> = {};
const clientsGroup = new Map<WebSocket, string>();
const clientsPublicKeys = new Map<WebSocket, string>();

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    handle(req, res, parse(req.url || "", true));
  });

  const wss: WebSocketServer = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      const m = JSON.parse(message.toString());

      if (m?.type === "join") {
        const { roomId, publicKey } = m;

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

        if (publicKey) {
          clientsPublicKeys.set(ws, publicKey);
        }

        if (rooms[roomId].size === 2) {
          const [client1, client2] = [...rooms[roomId]];
          const publicKey1 = clientsPublicKeys.get(client1);
          const publicKey2 = clientsPublicKeys.get(client2);

          if (publicKey1 && publicKey2) {
            if (publicKey1 && client1.readyState === WebSocket.OPEN) {
              client1.send(
                JSON.stringify({
                  type: "peer-public-key",
                  publicKey: publicKey2,
                }),
              );
            }

            if (publicKey2 && client2.readyState === WebSocket.OPEN) {
              client2.send(
                JSON.stringify({
                  type: "peer-public-key",
                  publicKey: publicKey1,
                }),
              );
            }
          }
        }

        for (const client of rooms[roomId]) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "peer-joined",
                count: rooms[roomId].size,
              }),
            );
          }
        }
      } else if (m?.type === "message") {
        const roomId = clientsRoom.get(ws);
        if (!roomId) return;

        for (const client of rooms[roomId]) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "message",
                ...m,
              }),
            );
          }
        }
      } else if (m?.type === "typing") {
        const roomId = clientsRoom.get(ws);
        if (!roomId) return;
        for (const client of rooms[roomId]) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "typing",
                isTyping: m?.isTyping,
              }),
            );
          }
        }
      } else if (
        m.type === "webrtc-offer" ||
        m.type === "webrtc-answer" ||
        m.type === "webrtc-ice"
      ) {
        const roomId = clientsRoom.get(ws);
        if (!roomId) return;
        for (const client of rooms[roomId]) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(m));
          }
        }
      } else if (m.type === "call-ended") {
        const roomId = clientsRoom.get(ws);
        if (!roomId) return;
        for (const client of rooms[roomId]) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "call-ended" }));
          }
        }
      } else if (m.type === "join-room") {
        const { roomId, roomName, roomPassword } = m;

        if (!groups[roomId]) {
          if (!roomName || !roomPassword) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Room name and password are required to create a room",
              }),
            );
            ws.close();
            return;
          }
        }
      }
    });

    ws.on("close", () => {
      const roomId = clientsRoom.get(ws);

      if (!roomId) return;

      if (roomId && rooms[roomId]) {
        rooms[roomId].delete(ws);
        for (const client of rooms[roomId]) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "peer-left",
                count: rooms[roomId].size,
              }),
            );
          }
        }
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

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
