import express from "express";
import { Podcast, uploadPodcast, deletePodcast } from "../controller/podcastController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", Podcast);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("thumbnail"),
  uploadPodcast,
);
router.delete("/:id", authMiddleware, adminMiddleware, deletePodcast);

export default router;
