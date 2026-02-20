import express from "express";

const route = express.Router();
import { playList } from "../controller/playlistController.js";
route.post("/playlist", playList);
export default route;
