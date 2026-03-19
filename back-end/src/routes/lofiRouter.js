import express from "express";
import multer from "multer";
import { uploadLofi, getLofiTracks } from "../controller/lofiController.js";

const router = express.Router();

// Save files to public/lofi
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/lofi"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadLofi);
router.get("/", getLofiTracks);

export default router;
