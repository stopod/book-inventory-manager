import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { config } from "dotenv";
import { apiRouter } from "./presentation/api/router";

// Load environment variables
config();

const app = new Hono();

// Middleware - 単純なロガーと詳細なCORS設定
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://book-inventory-manager-iota.vercel.app",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  })
);

// API Routes
app.route("/api", apiRouter);

// Health check
app.get("/", (c) =>
  c.json({ status: "ok", message: "Book Inventory API is running" })
);

// Not found handler
app.notFound((c) => {
  return c.json(
    {
      status: 404,
      message: "Not Found",
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      status: 500,
      message: "Internal Server Error",
    },
    500
  );
});

// Start server
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
