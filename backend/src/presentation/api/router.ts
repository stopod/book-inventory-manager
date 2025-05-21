import { Hono } from "hono";
import { authRouter } from "./auth-router";
import { bookRouter } from "./book-router";
import { authMiddleware } from "../middlewares/auth-middleware";

export const apiRouter = new Hono();

// Auth routes - no authentication required
apiRouter.route("/auth", authRouter);

// Protected routes - authentication required
// 認証ミドルウェアコメントアウト（必要に応じて復活させて下さい）
apiRouter.use("/books/*", authMiddleware);
apiRouter.route("/books", bookRouter);
