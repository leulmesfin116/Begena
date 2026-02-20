import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
export const authMiddleware = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({ error: "user is unathorized" });
  }
  try {
    const decode = jwt.verify(token, process.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decode.id },
    });
    if (!user) {
      return res.status(401).json({ error: "user is not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "not authorized,token failed" });
  }
};
