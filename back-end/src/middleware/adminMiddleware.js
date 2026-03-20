import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "ADMIN only" });
  }
  next();
};
