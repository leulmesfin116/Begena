import { prisma } from "../config/db.js";
const register = async (req, res) => {
  const { name, password, email } = req.body;

  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (userExist) {
    return res.status(400).json({ error: "user alrady exist with this password" });
  }
};

export { register };
