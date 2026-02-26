import express from "express";
import { upload } from "../upload/upload.js";

const router = express.Router();

router.post("/", upload.single("audio"), async (req, res) => {
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({ url: fileUrl });
});

export default router;
