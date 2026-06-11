import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import next from "next";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
