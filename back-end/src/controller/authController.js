import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
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
};
// hash password
const salt = await bcrypt.genSalt(11);
const hashedPassword = await bcrypt.hash(password, salt);
export { register };
