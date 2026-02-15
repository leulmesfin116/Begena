import express from "express";

const router = express.Router();

import { addSong } from "../controller/addSongs.js";

router.post("/addSong", addSong);

export default router;
