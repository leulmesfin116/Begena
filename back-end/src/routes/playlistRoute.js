import express from "express";
const route = express.Router();

import { authMiddleware } from "../middleware/authMiddleware.js";
import { playList } from "../controller/playlistController.js";

route.use(authMiddleware);
route.post("/playlist", playList);
export default route;
