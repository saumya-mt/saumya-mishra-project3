import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import highscoreRouter from "./routes/highscoreRoutes.js";
import User from "./models/User.js";
import sudokuRouter from "./routes/sudokuRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../../frontend/dist");

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api/user", userRouter);
app.use("/api/sudoku", sudokuRouter);
app.use("/api/highscore", highscoreRouter);

app.post("/api/logout", async (request, response, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME || "sudoku_session";
    const sessionToken = request.cookies[cookieName];

    if (sessionToken) {
      await User.updateOne({ sessionToken }, { $set: { sessionToken: null } });
    }

    response.clearCookie(cookieName);
    response.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));

  app.get("/{*path}", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      next();
      return;
    }

    response.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    error: error.message || "Unexpected server error",
  });
});

export default app;
