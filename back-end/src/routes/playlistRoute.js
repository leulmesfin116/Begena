import express from "express";

const route = express.Router();
import { Playlist } from "../controller/playlistController";
route.post("/playlist", Playlist);
export default route;
