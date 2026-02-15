import express from "express";

const router = express.Router();
import { addtoFav } from "../controller/favSongController.js";

router.post("/addtoFav", addtoFav);

export default router;
