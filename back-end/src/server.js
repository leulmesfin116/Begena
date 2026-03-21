import "dotenv/config";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import songRoute from "./routes/songRoutes.js";
import authRoute from "./routes/authRoutes.js";
import favRoute from "./routes/favSongRoute.js";
import playlistRoute from "./routes/playlistRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import podcastRoute from "./routes/podcastRoute.js";
import lofiUpload from "./routes/lofiRouter.js";

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

const isLocalDevOrigin = (origin) => {
  if (typeof origin !== "string") return false;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
};

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

// middle ware
app.use("/uploads", express.static("uploads"));
app.use("/lofi", express.static("public/lofi"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// api routes
app.use("/song", songRoute);
app.use("/auth", authRoute);
app.use("/fav", favRoute);
app.use("/play", playlistRoute);
app.use("/api", uploadRoute);
app.use("/api/podcasts", podcastRoute);
app.use("/api/lofi", lofiUpload);

// 404 handler (always JSON so clients can safely parse)
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler (always JSON so clients can safely parse)
app.use((err, req, res, next) => {
  const message = err?.message || "Internal Server Error";
  const status =
    err?.status ||
    (typeof message === "string" && message.startsWith("CORS blocked")
      ? 403
      : 500);

  console.error("Error:", err);
  if (res.headersSent) return next(err);
  res.status(status).json({ message });
});

const PORT = 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

// handle unhandke promise rejection
process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// handle uncaught exception
process.on("uncaughtException", async (err) => {
  console.error("uncaughtException", err);
  await disconnectDB();
  process.exit(1);
});
// graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM recieved,shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
