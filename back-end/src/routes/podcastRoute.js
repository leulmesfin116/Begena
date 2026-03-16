import express from "express";

const router = express.Router();
import { Podcast } from "../controller/podcastController.js";
router.get("/", Podcast);
export default router;
