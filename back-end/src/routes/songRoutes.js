import express from "express";

const router = express.Router();

import { addSong } from "../controller/addSongs.js";
import { searchSongs } from "../controller/searchSongs.js";

router.post("/addSong", addSong);
router.get("/search", searchSongs);

export default router;
