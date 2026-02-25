import express from "express";

const router = express.Router();
import { addtoFav } from "../controller/favSongController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.use(authMiddleware);
router.post("/addtoFav", addtoFav);

export default router;
