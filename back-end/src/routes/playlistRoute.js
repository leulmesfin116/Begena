import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const route = express.Router();

import { playList } from "../controller/playlistController.js";

route.use(authMiddleware);
route.post("/playlist", playList);
export default route;
