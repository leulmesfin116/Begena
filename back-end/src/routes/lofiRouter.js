import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadLofi, getLofiTracks } from "../controller/lofiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, adminMiddleware, upload.fields([{ name: "file", maxCount: 1 }, { name: "poster", maxCount: 1 }]), uploadLofi);
router.get("/", getLofiTracks);

export default router;
