import { prismaClient } from "@prisma/client";

const prisma = new prismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});
