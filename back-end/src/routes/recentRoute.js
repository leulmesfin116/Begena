import express from "express";

const router = express.Router();
import { recent } from "../controller/recentController.js";

router.get("/played", recent);

export default router;
