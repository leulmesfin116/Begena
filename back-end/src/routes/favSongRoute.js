import express from "express";

const router = express.Router();
import { addtoFav, getFavorites } from "../controller/favSongController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.use(authMiddleware);
router.post("/addtoFav", addtoFav);
router.get("/", getFavorites);

export default router;
