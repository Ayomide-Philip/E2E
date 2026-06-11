import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import next from "next";
import { parse } from "node:url";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
// const clients: Set<WebSocket> = new Set();

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    handle(req, res, parse(req.url || "", true));
  });

  const wss: WebSocketServer = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("WebSocket connection established");
    ws.on("message", (message: string) => {
      console.log("Received message:", message.toString());
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
});
