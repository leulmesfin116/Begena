import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // save user
  await prisma.User.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });
});
//  for the login page
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  prisma.User, findUn;

  const user = await prisma.User.findUnique({ where: { email } });

  if (!User) return re;
});
export default router;
