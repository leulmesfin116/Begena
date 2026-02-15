import "dotenv/config";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";

import songRoute from "./routes/songRoutes.js";
import authRoute from "./routes/authRoutes.js";

connectDB();

const app = express();

// middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// api routes
app.use("/song", songRoute);
app.use("/auth", authRoute);

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
