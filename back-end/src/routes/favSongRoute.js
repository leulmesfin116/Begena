import express from "express";

const router = express.Router();
import { addtoWatchList } from "../controller/favSongController.js";

router.post("/", addtoWatchList);

export default router;
