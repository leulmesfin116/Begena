import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
export const authMiddleware = async (req, res, next) => {
  let token;
  if (
    req.header.authorization &&
    req.header.authorization.startWith("Bearer")
  ) {
    token = req.header.authorization.split(" ")[1];
  } else if (req.cookie.jwt) {
    token = req.cookie.jwt;
  }
  if (!token) {
    return res.status(401).json({ message: "user is unathorized" });
  }
};
