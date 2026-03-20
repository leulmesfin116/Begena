import express from "express";
import multer from "multer";
import { uploadLofi, getLofiTracks } from "../controller/lofiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Save files to public/lofi
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/lofi"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", authMiddleware, adminMiddleware, upload.fields([{ name: "file", maxCount: 1 }, { name: "poster", maxCount: 1 }]), uploadLofi);
router.get("/", getLofiTracks);

export default router;
