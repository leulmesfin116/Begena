import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
const register = async (req, res) => {
  const { name, password, email } = req.body;

  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (userExist) {
    return res
      .status(400)
      .json({ error: "user alrady exist with this password" });
  }
  // hash password
  const salt = await bcrypt.genSalt(11);
  const hashedPassword = await bcrypt.hash(password, salt);
  // creating a user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  // generating token
  const token = generateToken(user.id, res);

  res.status(201).json({
    satus: "success",
    data: {
      id: user.id,
      name: name,
      email: email,
    },
    token,
  });
};
// Login functionality
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(400).json({ message: "invalid email and password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "invalid email and password" });
  }
  // Generate token
  const token = generateToken(user.id, res);
  res.status(201).json({
    satus: "success",
    data: {
      id: user.id,
      email: email,
    },
    token,
  });
};
// log out
const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
};
export { register, login, logout };
