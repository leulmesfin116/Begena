import express from "express";

const router = express.Router();

import { song } from "../controller/addSongs.js";

router.post("/song", song);

export default router;
