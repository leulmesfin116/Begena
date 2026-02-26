import "dotenv/config";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import songRoute from "./routes/songRoutes.js";
import authRoute from "./routes/authRoutes.js";
import favRoute from "./routes/favSongRoute.js";
import recentRoute from "./routes/recentRoute.js";
import playlistRoute from "./routes/playlistRoute.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  }),
);

// middle ware
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// api routes
app.use("/song", songRoute);
app.use("/auth", authRoute);
app.use("/fav", favRoute);
app.use("/recent", recentRoute);
app.use("/play", playlistRoute);

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
